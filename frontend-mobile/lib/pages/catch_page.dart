import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';

class AddCatchPage extends StatefulWidget {
  final VoidCallback? onSwitchToProfile;
  const AddCatchPage({super.key, this.onSwitchToProfile});

  @override
  State<AddCatchPage> createState() => _AddCatchPageState();
}

class _AddCatchPageState extends State<AddCatchPage> with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  String? _species;
  final _weightController = TextEditingController();
  final _lengthController = TextEditingController();
  final _locationController = TextEditingController();
  final _notesController = TextEditingController();
  File? _selectedPhoto;
  bool _isSubmitting = false;
  
  late AnimationController _photoAnimationController;
  late Animation<double> _photoAnimation;

  // Sorted fish species for better UX
  final List<String> _fishSpecies = [
    'Bluegill',
    'Catfish',
    'Crappie',
    'Largemouth Bass',
    'Peacock Bass',
    'Redfish',
    'Smallmouth Bass',
    'Snook',
    'Tarpon',
    'Trout',
  ];

  @override
  void initState() {
    super.initState();
    _photoAnimationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _photoAnimation = CurvedAnimation(
      parent: _photoAnimationController,
      curve: Curves.easeInOut,
    );
  }

  @override
  void dispose() {
    _weightController.dispose();
    _lengthController.dispose();
    _locationController.dispose();
    _notesController.dispose();
    _photoAnimationController.dispose();
    super.dispose();
  }

  Future<void> _selectPhotoSource() async {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Add Photo',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildPhotoOption(
                  icon: Icons.camera_alt,
                  label: 'Camera',
                  onTap: () => _pickImage(ImageSource.camera),
                ),
                _buildPhotoOption(
                  icon: Icons.photo_library,
                  label: 'Gallery',
                  onTap: () => _pickImage(ImageSource.gallery),
                ),
              ],
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildPhotoOption({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
        onTap();
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, size: 28, color: const Color(0xFF2563EB)),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final pickedFile = await ImagePicker().pickImage(
        source: source,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );
      
      if (pickedFile != null) {
        setState(() {
          _selectedPhoto = File(pickedFile.path);
        });
        _photoAnimationController.forward();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error selecting photo: $e'),
            backgroundColor: Colors.red.shade600,
          ),
        );
      }
    }
  }

  Future<void> _submitCatch() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() {
      _isSubmitting = true;
    });

    final apiService = context.read<ApiService>();
    
    try {
      await apiService.addCatch(
        species: _species!,
        weight: double.parse(_weightController.text),
        length: double.parse(_lengthController.text),
        location: _locationController.text,
        comment: _notesController.text,
        photo: _selectedPhoto,
      );
      
      if (mounted) {
        // Green success SnackBar
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.check_circle, color: Colors.white),
                SizedBox(width: 12),
                Text(
                  'Catch logged successfully!',
                  style: TextStyle(fontWeight: FontWeight.w600),
                ),
              ],
            ),
            backgroundColor: Colors.green.shade600,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            margin: const EdgeInsets.all(16),
            duration: const Duration(seconds: 2),
          ),
        );
        
        // Clear form after successful submission
        _clearForm();
        
        // Use the tab switching callback if available
        if (widget.onSwitchToProfile != null) {
          widget.onSwitchToProfile!();
        }
      }
    } catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $error'),
            backgroundColor: Colors.red.shade600,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            margin: const EdgeInsets.all(16),
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  void _clearForm() {
    setState(() {
      _species = null;
      _weightController.clear();
      _lengthController.clear();
      _locationController.clear();
      _notesController.clear();
      _selectedPhoto = null;
    });
    _photoAnimationController.reset();
  }

  Widget _buildFormCard({required String title, required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String? Function(String?) validator,
    TextInputType? keyboardType,
    int maxLines = 1,
    bool isRequired = true,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: isRequired ? '$label *' : label,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
      ),
      keyboardType: keyboardType,
      maxLines: maxLines,
      validator: validator,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFFF3E0), Color(0xFFE0F7FA)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: CustomScrollView(
            slivers: [
              // Header
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Welcome-style header matching dashboard
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF2563EB), Color(0xFF0EA5E9)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF2563EB).withValues(alpha: 0.3),
                              blurRadius: 20,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.catching_pokemon, color: Colors.white, size: 28),
                                SizedBox(width: 12),
                                Text(
                                  'Log Your Catch',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 8),
                            Text(
                              'All your catches, all in one place!',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Required fields key
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.blue.shade50,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.blue.shade200),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.info_outline,
                              color: Colors.blue.shade600,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'Fields marked with * are required',
                              style: TextStyle(
                                color: Color.fromARGB(255, 229, 129, 30),
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      
                      // Form
                      Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            // Fish Details Card
                            _buildFormCard(
                              title: 'Fish Details',
                              child: Column(
                                children: [
                                  // Species Dropdown
                                  DropdownButtonFormField<String>(
                                    value: _species,
                                    decoration: InputDecoration(
                                      labelText: 'Fish Species *',
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                                    ),
                                    items: _fishSpecies.map((species) {
                                      return DropdownMenuItem(
                                        value: species,
                                        child: Text(species),
                                      );
                                    }).toList(),
                                    onChanged: (value) {
                                      setState(() {
                                        _species = value;
                                      });
                                    },
                                    validator: (value) => value == null ? 'Select fish species' : null,
                                  ),
                                  const SizedBox(height: 16),
                                  
                                  // Weight and Length Row
                                  Row(
                                    children: [
                                      Expanded(
                                        child: _buildTextField(
                                          controller: _weightController,
                                          label: 'Weight (lbs)',
                                          keyboardType: TextInputType.number,
                                          isRequired: true,
                                          validator: (value) {
                                            if (value?.isEmpty ?? true) {
                                              return 'Enter weight';
                                            }
                                            if (double.tryParse(value!) == null) {
                                              return 'Invalid number';
                                            }
                                            return null;
                                          },
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      Expanded(
                                        child: _buildTextField(
                                          controller: _lengthController,
                                          label: 'Length (in)',
                                          keyboardType: TextInputType.number,
                                          isRequired: true,
                                          validator: (value) {
                                            if (value?.isEmpty ?? true) {
                                              return 'Enter length';
                                            }
                                            if (double.tryParse(value!) == null) {
                                              return 'Invalid number';
                                            }
                                            return null;
                                          },
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  
                                  // Location
                                  _buildTextField(
                                    controller: _locationController,
                                    label: 'Location',
                                    isRequired: true,
                                    validator: (value) {
                                      if (value?.isEmpty ?? true) {
                                        return 'Enter location';
                                      }
                                      return null;
                                    },
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 20),
                            
                            // Photo Card
                            _buildFormCard(
                              title: 'Photo',
                              child: _buildPhotoSection(),
                            ),
                            const SizedBox(height: 20),
                            
                            // Notes Card
                            _buildFormCard(
                              title: 'Notes (Optional)',
                              child: _buildTextField(
                                controller: _notesController,
                                label: 'Share your fishing experience...',
                                maxLines: 4,
                                isRequired: false,
                                validator: (value) => null, // Optional field
                              ),
                            ),
                            const SizedBox(height: 24),
                            
                            // Submit Button
                            Container(
                              width: double.infinity,
                              height: 56,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFF2563EB), Color(0xFF0EA5E9)],
                                  begin: Alignment.centerLeft,
                                  end: Alignment.centerRight,
                                ),
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFF2563EB).withValues(alpha: 0.3),
                                    blurRadius: 20,
                                    offset: const Offset(0, 8),
                                  ),
                                ],
                              ),
                              child: ElevatedButton(
                                onPressed: _isSubmitting ? null : _submitCatch,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.transparent,
                                  shadowColor: Colors.transparent,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                ),
                                child: _isSubmitting
                                    ? const Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          SizedBox(
                                            width: 20,
                                            height: 20,
                                            child: CircularProgressIndicator(
                                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                              strokeWidth: 2,
                                            ),
                                          ),
                                          SizedBox(width: 12),
                                          Text(
                                            'Logging Catch...',
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      )
                                    : const Text(
                                        'Log Your Catch',
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                              ),
                            ),
                            const SizedBox(height: 20),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPhotoSection() {
    return GestureDetector(
      onTap: _selectPhotoSource,
      child: Container(
        height: 180,
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.grey.shade50,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: _selectedPhoto != null ? const Color(0xFF2563EB) : Colors.grey.shade300,
            width: _selectedPhoto != null ? 2 : 1,
          ),
        ),
        child: _selectedPhoto != null
            ? AnimatedBuilder(
                animation: _photoAnimation,
                builder: (context, child) {
                  return Transform.scale(
                    scale: _photoAnimation.value,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.file(
                        _selectedPhoto!,
                        fit: BoxFit.cover,
                      ),
                    ),
                  );
                },
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.add_a_photo,
                    size: 40,
                    color: Colors.grey.shade500,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Tap to add photo',
                    style: TextStyle(
                      color: Colors.grey.shade600,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Camera or Gallery',
                    style: TextStyle(
                      color: Colors.grey.shade500,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}





















// import 'dart:io';
// import 'package:flutter/material.dart';
// import 'package:image_picker/image_picker.dart';
// import 'package:provider/provider.dart';
// import '../services/api_service.dart';

// class AddCatchPage extends StatefulWidget {
//   final VoidCallback? onSwitchToProfile;
//   const AddCatchPage({super.key, this.onSwitchToProfile});

//   @override
//   State<AddCatchPage> createState() => _AddCatchPageState();
// }

// class _AddCatchPageState extends State<AddCatchPage> with TickerProviderStateMixin {
//   final _formKey = GlobalKey<FormState>();
//   String? _species;
//   final _weightController = TextEditingController();
//   final _lengthController = TextEditingController();
//   final _locationController = TextEditingController();
//   final _notesController = TextEditingController();
//   File? _selectedPhoto;
//   bool _isSubmitting = false;
  
//   late AnimationController _photoAnimationController;
//   late Animation<double> _photoAnimation;

//   // Sorted fish species for better UX
//   final List<String> _fishSpecies = [
//     'Bluegill',
//     'Catfish',
//     'Crappie',
//     'Largemouth Bass',
//     'Peacock Bass',
//     'Redfish',
//     'Smallmouth Bass',
//     'Snook',
//     'Tarpon',
//     'Trout',
//   ];

//   @override
//   void initState() {
//     super.initState();
//     _photoAnimationController = AnimationController(
//       duration: const Duration(milliseconds: 300),
//       vsync: this,
//     );
//     _photoAnimation = CurvedAnimation(
//       parent: _photoAnimationController,
//       curve: Curves.easeInOut,
//     );
//   }

//   @override
//   void dispose() {
//     _weightController.dispose();
//     _lengthController.dispose();
//     _locationController.dispose();
//     _notesController.dispose();
//     _photoAnimationController.dispose();
//     super.dispose();
//   }

//   Future<void> _selectPhotoSource() async {
//     showModalBottomSheet(
//       context: context,
//       backgroundColor: Colors.transparent,
//       builder: (context) => Container(
//         padding: const EdgeInsets.all(20),
//         decoration: const BoxDecoration(
//           color: Colors.white,
//           borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
//         ),
//         child: Column(
//           mainAxisSize: MainAxisSize.min,
//           children: [
//             Container(
//               width: 40,
//               height: 4,
//               decoration: BoxDecoration(
//                 color: Colors.grey[300],
//                 borderRadius: BorderRadius.circular(2),
//               ),
//             ),
//             const SizedBox(height: 16),
//             const Text(
//               'Add Photo',
//               style: TextStyle(
//                 fontSize: 18,
//                 fontWeight: FontWeight.bold,
//               ),
//             ),
//             const SizedBox(height: 16),
//             Row(
//               mainAxisAlignment: MainAxisAlignment.spaceEvenly,
//               children: [
//                 _buildPhotoOption(
//                   icon: Icons.camera_alt,
//                   label: 'Camera',
//                   onTap: () => _pickImage(ImageSource.camera),
//                 ),
//                 _buildPhotoOption(
//                   icon: Icons.photo_library,
//                   label: 'Gallery',
//                   onTap: () => _pickImage(ImageSource.gallery),
//                 ),
//               ],
//             ),
//             const SizedBox(height: 16),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _buildPhotoOption({
//     required IconData icon,
//     required String label,
//     required VoidCallback onTap,
//   }) {
//     return GestureDetector(
//       onTap: () {
//         Navigator.pop(context);
//         onTap();
//       },
//       child: Container(
//         padding: const EdgeInsets.all(16),
//         decoration: BoxDecoration(
//           color: Colors.white,
//           borderRadius: BorderRadius.circular(12),
//           border: Border.all(color: Colors.grey.shade200),
//           boxShadow: [
//             BoxShadow(
//               color: Colors.black.withValues(alpha: 0.05),
//               blurRadius: 10,
//               offset: const Offset(0, 2),
//             ),
//           ],
//         ),
//         child: Column(
//           children: [
//             Icon(icon, size: 28, color: const Color(0xFF2563EB)),
//             const SizedBox(height: 8),
//             Text(
//               label,
//               style: const TextStyle(
//                 fontWeight: FontWeight.w600,
//                 color: Colors.black87,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Future<void> _pickImage(ImageSource source) async {
//     try {
//       final pickedFile = await ImagePicker().pickImage(
//         source: source,
//         maxWidth: 1920,
//         maxHeight: 1080,
//         imageQuality: 85,
//       );
      
//       if (pickedFile != null) {
//         setState(() {
//           _selectedPhoto = File(pickedFile.path);
//         });
//         _photoAnimationController.forward();
//       }
//     } catch (e) {
//       if (mounted) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(
//             content: Text('Error selecting photo: $e'),
//             backgroundColor: Colors.red.shade600,
//           ),
//         );
//       }
//     }
//   }

//   Future<void> _submitCatch() async {
//     if (!_formKey.currentState!.validate()) return;
    
//     setState(() {
//       _isSubmitting = true;
//     });

//     final apiService = context.read<ApiService>();
    
//     try {
//       await apiService.addCatch(
//         species: _species!,
//         weight: double.parse(_weightController.text),
//         length: double.parse(_lengthController.text),
//         location: _locationController.text,
//         comment: _notesController.text,
//         photo: _selectedPhoto,
//       );
      
//       if (mounted) {
//         // Green success SnackBar
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(
//             content: const Row(
//               children: [
//                 Icon(Icons.check_circle, color: Colors.white),
//                 SizedBox(width: 12),
//                 Text(
//                   'Catch logged successfully!',
//                   style: TextStyle(fontWeight: FontWeight.w600),
//                 ),
//               ],
//             ),
//             backgroundColor: Colors.green.shade600,
//             behavior: SnackBarBehavior.floating,
//             shape: RoundedRectangleBorder(
//               borderRadius: BorderRadius.circular(8),
//             ),
//             margin: const EdgeInsets.all(16),
//             duration: const Duration(seconds: 2),
//           ),
//         );
        
//         // Clear form after successful submission
//         _clearForm();
        
//         // Use the tab switching callback if available
//         if (widget.onSwitchToProfile != null) {
//           widget.onSwitchToProfile!();
//         }
//       }
//     } catch (error) {
//       if (mounted) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(
//             content: Text('Error: $error'),
//             backgroundColor: Colors.red.shade600,
//             behavior: SnackBarBehavior.floating,
//             shape: RoundedRectangleBorder(
//               borderRadius: BorderRadius.circular(8),
//             ),
//             margin: const EdgeInsets.all(16),
//           ),
//         );
//       }
//     } finally {
//       if (mounted) {
//         setState(() {
//           _isSubmitting = false;
//         });
//       }
//     }
//   }

//   void _clearForm() {
//     setState(() {
//       _species = null;
//       _weightController.clear();
//       _lengthController.clear();
//       _locationController.clear();
//       _notesController.clear();
//       _selectedPhoto = null;
//     });
//     _photoAnimationController.reset();
//   }

//   Widget _buildFormCard({required String title, required Widget child}) {
//     return Container(
//       padding: const EdgeInsets.all(20),
//       decoration: BoxDecoration(
//         color: Colors.white,
//         borderRadius: BorderRadius.circular(16),
//         boxShadow: [
//           BoxShadow(
//             color: Colors.black.withValues(alpha: 0.05),
//             blurRadius: 10,
//             offset: const Offset(0, 2),
//           ),
//         ],
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Text(
//             title,
//             style: const TextStyle(
//               fontSize: 18,
//               fontWeight: FontWeight.bold,
//               color: Colors.black87,
//             ),
//           ),
//           const SizedBox(height: 16),
//           child,
//         ],
//       ),
//     );
//   }

//   Widget _buildTextField({
//     required TextEditingController controller,
//     required String label,
//     required String? Function(String?) validator,
//     TextInputType? keyboardType,
//     int maxLines = 1,
//   }) {
//     return TextFormField(
//       controller: controller,
//       decoration: InputDecoration(
//         labelText: label,
//         border: OutlineInputBorder(
//           borderRadius: BorderRadius.circular(8),
//         ),
//         contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
//       ),
//       keyboardType: keyboardType,
//       maxLines: maxLines,
//       validator: validator,
//     );
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Container(
//         decoration: const BoxDecoration(
//           gradient: LinearGradient(
//             colors: [Color(0xFFFFF3E0), Color(0xFFE0F7FA)],
//             begin: Alignment.topCenter,
//             end: Alignment.bottomCenter,
//           ),
//         ),
//         child: SafeArea(
//           child: CustomScrollView(
//             slivers: [
//               // Header
//               SliverToBoxAdapter(
//                 child: Padding(
//                   padding: const EdgeInsets.all(20),
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: [
//                       // Welcome-style header matching dashboard
//                       Container(
//                         padding: const EdgeInsets.all(24),
//                         decoration: BoxDecoration(
//                           gradient: const LinearGradient(
//                             colors: [Color(0xFF2563EB), Color(0xFF0EA5E9)],
//                             begin: Alignment.topLeft,
//                             end: Alignment.bottomRight,
//                           ),
//                           borderRadius: BorderRadius.circular(20),
//                           boxShadow: [
//                             BoxShadow(
//                               color: const Color(0xFF2563EB).withValues(alpha: 0.3),
//                               blurRadius: 20,
//                               offset: const Offset(0, 8),
//                             ),
//                           ],
//                         ),
//                         child: const Column(
//                           crossAxisAlignment: CrossAxisAlignment.start,
//                           children: [
//                             Row(
//                               children: [
//                                 Icon(Icons.catching_pokemon, color: Colors.white, size: 28),
//                                 SizedBox(width: 12),
//                                 Text(
//                                   'Log Your Catch',
//                                   style: TextStyle(
//                                     color: Colors.white,
//                                     fontSize: 24,
//                                     fontWeight: FontWeight.bold,
//                                   ),
//                                 ),
//                               ],
//                             ),
//                             SizedBox(height: 8),
//                             Text(
//                               'Share your fishing success with the community!',
//                               style: TextStyle(
//                                 color: Colors.white70,
//                                 fontSize: 16,
//                               ),
//                             ),
//                           ],
//                         ),
//                       ),
//                       const SizedBox(height: 20),
                      
//                       // Form
//                       Form(
//                         key: _formKey,
//                         child: Column(
//                           children: [
//                             // Fish Details Card
//                             _buildFormCard(
//                               title: 'Fish Details',
//                               child: Column(
//                                 children: [
//                                   // Species Dropdown
//                                   DropdownButtonFormField<String>(
//                                     value: _species,
//                                     decoration: InputDecoration(
//                                       labelText: 'Fish Species',
//                                       border: OutlineInputBorder(
//                                         borderRadius: BorderRadius.circular(8),
//                                       ),
//                                       contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
//                                     ),
//                                     items: _fishSpecies.map((species) {
//                                       return DropdownMenuItem(
//                                         value: species,
//                                         child: Text(species),
//                                       );
//                                     }).toList(),
//                                     onChanged: (value) {
//                                       setState(() {
//                                         _species = value;
//                                       });
//                                     },
//                                     validator: (value) => value == null ? 'Select fish species' : null,
//                                   ),
//                                   const SizedBox(height: 16),
                                  
//                                   // Weight and Length Row
//                                   Row(
//                                     children: [
//                                       Expanded(
//                                         child: _buildTextField(
//                                           controller: _weightController,
//                                           label: 'Weight (lbs)',
//                                           keyboardType: TextInputType.number,
//                                           validator: (value) {
//                                             if (value?.isEmpty ?? true) {
//                                               return 'Enter weight';
//                                             }
//                                             if (double.tryParse(value!) == null) {
//                                               return 'Invalid number';
//                                             }
//                                             return null;
//                                           },
//                                         ),
//                                       ),
//                                       const SizedBox(width: 16),
//                                       Expanded(
//                                         child: _buildTextField(
//                                           controller: _lengthController,
//                                           label: 'Length (in)',
//                                           keyboardType: TextInputType.number,
//                                           validator: (value) {
//                                             if (value?.isEmpty ?? true) {
//                                               return 'Enter length';
//                                             }
//                                             if (double.tryParse(value!) == null) {
//                                               return 'Invalid number';
//                                             }
//                                             return null;
//                                           },
//                                         ),
//                                       ),
//                                     ],
//                                   ),
//                                   const SizedBox(height: 16),
                                  
//                                   // Location
//                                   _buildTextField(
//                                     controller: _locationController,
//                                     label: 'Location',
//                                     validator: (value) {
//                                       if (value?.isEmpty ?? true) {
//                                         return 'Enter location';
//                                       }
//                                       return null;
//                                     },
//                                   ),
//                                 ],
//                               ),
//                             ),
//                             const SizedBox(height: 20),
                            
//                             // Photo Card
//                             _buildFormCard(
//                               title: 'Photo',
//                               child: _buildPhotoSection(),
//                             ),
//                             const SizedBox(height: 20),
                            
//                             // Notes Card
//                             _buildFormCard(
//                               title: 'Notes',
//                               child: _buildTextField(
//                                 controller: _notesController,
//                                 label: 'Share your fishing experience...',
//                                 maxLines: 4,
//                                 validator: (value) => null, // Optional field
//                               ),
//                             ),
//                             const SizedBox(height: 24),
                            
//                             // Submit Button
//                             Container(
//                               width: double.infinity,
//                               height: 56,
//                               decoration: BoxDecoration(
//                                 gradient: const LinearGradient(
//                                   colors: [Color(0xFF2563EB), Color(0xFF0EA5E9)],
//                                   begin: Alignment.centerLeft,
//                                   end: Alignment.centerRight,
//                                 ),
//                                 borderRadius: BorderRadius.circular(16),
//                                 boxShadow: [
//                                   BoxShadow(
//                                     color: const Color(0xFF2563EB).withValues(alpha: 0.3),
//                                     blurRadius: 20,
//                                     offset: const Offset(0, 8),
//                                   ),
//                                 ],
//                               ),
//                               child: ElevatedButton(
//                                 onPressed: _isSubmitting ? null : _submitCatch,
//                                 style: ElevatedButton.styleFrom(
//                                   backgroundColor: Colors.transparent,
//                                   shadowColor: Colors.transparent,
//                                   shape: RoundedRectangleBorder(
//                                     borderRadius: BorderRadius.circular(16),
//                                   ),
//                                 ),
//                                 child: _isSubmitting
//                                     ? const Row(
//                                         mainAxisAlignment: MainAxisAlignment.center,
//                                         children: [
//                                           SizedBox(
//                                             width: 20,
//                                             height: 20,
//                                             child: CircularProgressIndicator(
//                                               valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
//                                               strokeWidth: 2,
//                                             ),
//                                           ),
//                                           SizedBox(width: 12),
//                                           Text(
//                                             'Logging Catch...',
//                                             style: TextStyle(
//                                               color: Colors.white,
//                                               fontSize: 16,
//                                               fontWeight: FontWeight.bold,
//                                             ),
//                                           ),
//                                         ],
//                                       )
//                                     : const Text(
//                                         'Log Your Catch',
//                                         style: TextStyle(
//                                           color: Colors.white,
//                                           fontSize: 16,
//                                           fontWeight: FontWeight.bold,
//                                         ),
//                                       ),
//                               ),
//                             ),
//                             const SizedBox(height: 20),
//                           ],
//                         ),
//                       ),
//                     ],
//                   ),
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }

//   Widget _buildPhotoSection() {
//     return GestureDetector(
//       onTap: _selectPhotoSource,
//       child: Container(
//         height: 180,
//         width: double.infinity,
//         decoration: BoxDecoration(
//           color: Colors.grey.shade50,
//           borderRadius: BorderRadius.circular(12),
//           border: Border.all(
//             color: _selectedPhoto != null ? const Color(0xFF2563EB) : Colors.grey.shade300,
//             width: _selectedPhoto != null ? 2 : 1,
//           ),
//         ),
//         child: _selectedPhoto != null
//             ? AnimatedBuilder(
//                 animation: _photoAnimation,
//                 builder: (context, child) {
//                   return Transform.scale(
//                     scale: _photoAnimation.value,
//                     child: ClipRRect(
//                       borderRadius: BorderRadius.circular(10),
//                       child: Image.file(
//                         _selectedPhoto!,
//                         fit: BoxFit.cover,
//                       ),
//                     ),
//                   );
//                 },
//               )
//             : Column(
//                 mainAxisAlignment: MainAxisAlignment.center,
//                 children: [
//                   Icon(
//                     Icons.add_a_photo,
//                     size: 40,
//                     color: Colors.grey.shade500,
//                   ),
//                   const SizedBox(height: 8),
//                   Text(
//                     'Tap to add photo',
//                     style: TextStyle(
//                       color: Colors.grey.shade600,
//                       fontSize: 14,
//                       fontWeight: FontWeight.w500,
//                     ),
//                   ),
//                   const SizedBox(height: 4),
//                   Text(
//                     'Camera or Gallery',
//                     style: TextStyle(
//                       color: Colors.grey.shade500,
//                       fontSize: 12,
//                     ),
//                   ),
//                 ],
//               ),
//       ),
//     );
//   }
// }






// // import 'dart:io';
// // import 'package:flutter/material.dart';
// // import 'package:image_picker/image_picker.dart';
// // import 'package:provider/provider.dart';
// // import '../services/api_service.dart';

// // class AddCatchPage extends StatefulWidget {
// //   final VoidCallback? onSwitchToProfile;
// //   const AddCatchPage({super.key, this.onSwitchToProfile});

// //   @override
// //   State<AddCatchPage> createState() => _AddCatchPageState();
// // }

// // class _AddCatchPageState extends State<AddCatchPage> with TickerProviderStateMixin {
// //   final _formKey = GlobalKey<FormState>();
// //   String? _species;
// //   final _weightController = TextEditingController();
// //   final _lengthController = TextEditingController();
// //   final _locationController = TextEditingController();
// //   final _notesController = TextEditingController();
// //   File? _selectedPhoto;
// //   bool _isSubmitting = false;
  
// //   late AnimationController _photoAnimationController;
// //   late Animation<double> _photoAnimation;

// //   // Sorted fish species for better UX
// //   final List<String> _fishSpecies = [
// //     'Bluegill',
// //     'Catfish',
// //     'Crappie',
// //     'Largemouth Bass',
// //     'Peacock Bass',
// //     'Redfish',
// //     'Smallmouth Bass',
// //     'Snook',
// //     'Tarpon',
// //     'Trout',
// //   ];

// //   @override
// //   void initState() {
// //     super.initState();
// //     _photoAnimationController = AnimationController(
// //       duration: const Duration(milliseconds: 300),
// //       vsync: this,
// //     );
// //     _photoAnimation = CurvedAnimation(
// //       parent: _photoAnimationController,
// //       curve: Curves.easeInOut,
// //     );
// //   }

// //   @override
// //   void dispose() {
// //     _weightController.dispose();
// //     _lengthController.dispose();
// //     _locationController.dispose();
// //     _notesController.dispose();
// //     _photoAnimationController.dispose();
// //     super.dispose();
// //   }

// //   Future<void> _selectPhotoSource() async {
// //     showModalBottomSheet(
// //       context: context,
// //       backgroundColor: Colors.transparent,
// //       builder: (context) => Container(
// //         padding: const EdgeInsets.all(20),
// //         decoration: const BoxDecoration(
// //           color: Colors.white,
// //           borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
// //         ),
// //         child: Column(
// //           mainAxisSize: MainAxisSize.min,
// //           children: [
// //             Container(
// //               width: 40,
// //               height: 4,
// //               decoration: BoxDecoration(
// //                 color: Colors.grey[300],
// //                 borderRadius: BorderRadius.circular(2),
// //               ),
// //             ),
// //             const SizedBox(height: 20),
// //             Text(
// //               'Add Photo',
// //               style: Theme.of(context).textTheme.titleLarge?.copyWith(
// //                 fontWeight: FontWeight.bold,
// //               ),
// //             ),
// //             const SizedBox(height: 20),
// //             Row(
// //               mainAxisAlignment: MainAxisAlignment.spaceEvenly,
// //               children: [
// //                 _buildPhotoOption(
// //                   icon: Icons.camera_alt,
// //                   label: 'Camera',
// //                   onTap: () => _pickImage(ImageSource.camera),
// //                 ),
// //                 _buildPhotoOption(
// //                   icon: Icons.photo_library,
// //                   label: 'Gallery',
// //                   onTap: () => _pickImage(ImageSource.gallery),
// //                 ),
// //               ],
// //             ),
// //             const SizedBox(height: 20),
// //           ],
// //         ),
// //       ),
// //     );
// //   }

// //   Widget _buildPhotoOption({
// //     required IconData icon,
// //     required String label,
// //     required VoidCallback onTap,
// //   }) {
// //     return GestureDetector(
// //       onTap: () {
// //         Navigator.pop(context);
// //         onTap();
// //       },
// //       child: Container(
// //         padding: const EdgeInsets.all(20),
// //         decoration: BoxDecoration(
// //           color: Colors.orange.shade50,
// //           borderRadius: BorderRadius.circular(16),
// //           border: Border.all(color: Colors.orange.shade200),
// //         ),
// //         child: Column(
// //           children: [
// //             Icon(icon, size: 32, color: Colors.orange.shade600),
// //             const SizedBox(height: 8),
// //             Text(
// //               label,
// //               style: TextStyle(
// //                 fontWeight: FontWeight.w600,
// //                 color: Colors.orange.shade800,
// //               ),
// //             ),
// //           ],
// //         ),
// //       ),
// //     );
// //   }

// //   Future<void> _pickImage(ImageSource source) async {
// //     try {
// //       final pickedFile = await ImagePicker().pickImage(
// //         source: source,
// //         maxWidth: 1920,
// //         maxHeight: 1080,
// //         imageQuality: 85,
// //       );
      
// //       if (pickedFile != null) {
// //         setState(() {
// //           _selectedPhoto = File(pickedFile.path);
// //         });
// //         _photoAnimationController.forward();
// //       }
// //     } catch (e) {
// //       if (mounted) {
// //         ScaffoldMessenger.of(context).showSnackBar(
// //           SnackBar(
// //             content: Text('Error selecting photo: $e'),
// //             backgroundColor: Colors.red.shade600,
// //           ),
// //         );
// //       }
// //     }
// //   }

// //   Future<void> _submitCatch() async {
// //     if (!_formKey.currentState!.validate()) return;
    
// //     setState(() {
// //       _isSubmitting = true;
// //     });

// //     final apiService = context.read<ApiService>();
    
// //     try {
// //       await apiService.addCatch(
// //         species: _species!,
// //         weight: double.parse(_weightController.text),
// //         length: double.parse(_lengthController.text),
// //         location: _locationController.text,
// //         comment: _notesController.text,
// //         photo: _selectedPhoto,
// //       );
      
// //       if (mounted) {
// //         // Green success SnackBar
// //         ScaffoldMessenger.of(context).showSnackBar(
// //           SnackBar(
// //             content: const Row(
// //               children: [
// //                 Icon(Icons.check_circle, color: Colors.white),
// //                 SizedBox(width: 12),
// //                 Text(
// //                   'Catch logged successfully!',
// //                   style: TextStyle(fontWeight: FontWeight.w600),
// //                 ),
// //               ],
// //             ),
// //             backgroundColor: Colors.green.shade600,
// //             behavior: SnackBarBehavior.floating,
// //             shape: RoundedRectangleBorder(
// //               borderRadius: BorderRadius.circular(10),
// //             ),
// //             margin: const EdgeInsets.all(16),
// //             duration: const Duration(seconds: 2),
// //           ),
// //         );
        
// //         // Clear form after successful submission
// //         _clearForm();
        
// //         // Use the tab switching callback if available
// //         if (widget.onSwitchToProfile != null) {
// //           widget.onSwitchToProfile!();
// //         }
// //       }
// //     } catch (error) {
// //       if (mounted) {
// //         ScaffoldMessenger.of(context).showSnackBar(
// //           SnackBar(
// //             content: Text('Error: $error'),
// //             backgroundColor: Colors.red.shade600,
// //             behavior: SnackBarBehavior.floating,
// //             shape: RoundedRectangleBorder(
// //               borderRadius: BorderRadius.circular(10),
// //             ),
// //             margin: const EdgeInsets.all(16),
// //           ),
// //         );
// //       }
// //     } finally {
// //       if (mounted) {
// //         setState(() {
// //           _isSubmitting = false;
// //         });
// //       }
// //     }
// //   }

// //   void _clearForm() {
// //     setState(() {
// //       _species = null;
// //       _weightController.clear();
// //       _lengthController.clear();
// //       _locationController.clear();
// //       _notesController.clear();
// //       _selectedPhoto = null;
// //     });
// //     _photoAnimationController.reset();
// //   }

// //   @override
// //   Widget build(BuildContext context) {
// //     final theme = Theme.of(context);
    
// //     return Scaffold(
// //       body: Container(
// //         decoration: BoxDecoration(
// //           gradient: LinearGradient(
// //             begin: Alignment.topCenter,
// //             end: Alignment.bottomCenter,
// //             colors: [
// //               Colors.orange.shade400,
// //               Colors.cyan.shade400,
// //             ],
// //           ),
// //         ),
// //         child: SafeArea(
// //           child: Column(
// //             children: [
// //               // Modern Header
// //               Container(
// //                 padding: const EdgeInsets.all(20),
// //                 child: Row(
// //                   children: [
// //                     IconButton(
// //                       onPressed: () => Navigator.pop(context),
// //                       icon: const Icon(Icons.arrow_back, color: Colors.white),
// //                     ),
// //                     const SizedBox(width: 8),
// //                     Text(
// //                       'Log Your Catch',
// //                       style: theme.textTheme.headlineSmall?.copyWith(
// //                         color: Colors.white,
// //                         fontWeight: FontWeight.bold,
// //                       ),
// //                     ),
// //                   ],
// //                 ),
// //               ),
              
// //               // Form Content
// //               Expanded(
// //                 child: Container(
// //                   margin: const EdgeInsets.only(top: 20),
// //                   decoration: const BoxDecoration(
// //                     color: Colors.white,
// //                     borderRadius: BorderRadius.vertical(
// //                       top: Radius.circular(30),
// //                     ),
// //                   ),
// //                   child: SingleChildScrollView(
// //                     padding: const EdgeInsets.all(24),
// //                     child: Form(
// //                       key: _formKey,
// //                       child: Column(
// //                         crossAxisAlignment: CrossAxisAlignment.start,
// //                         children: [
// //                           _buildSectionTitle('Fish Details'),
// //                           const SizedBox(height: 16),
                          
// //                           // Species Dropdown
// //                           _buildModernDropdown(),
// //                           const SizedBox(height: 20),
                          
// //                           // Weight and Length Row
// //                           Row(
// //                             children: [
// //                               Expanded(
// //                                 child: _buildModernTextField(
// //                                   controller: _weightController,
// //                                   label: 'Weight (lbs)',
// //                                   icon: Icons.scale,
// //                                   keyboardType: TextInputType.number,
// //                                   validator: (value) {
// //                                     if (value?.isEmpty ?? true) {
// //                                       return 'Enter weight';
// //                                     }
// //                                     if (double.tryParse(value!) == null) {
// //                                       return 'Invalid number';
// //                                     }
// //                                     return null;
// //                                   },
// //                                 ),
// //                               ),
// //                               const SizedBox(width: 16),
// //                               Expanded(
// //                                 child: _buildModernTextField(
// //                                   controller: _lengthController,
// //                                   label: 'Length (in)',
// //                                   icon: Icons.straighten,
// //                                   keyboardType: TextInputType.number,
// //                                   validator: (value) {
// //                                     if (value?.isEmpty ?? true) {
// //                                       return 'Enter length';
// //                                     }
// //                                     if (double.tryParse(value!) == null) {
// //                                       return 'Invalid number';
// //                                     }
// //                                     return null;
// //                                   },
// //                                 ),
// //                               ),
// //                             ],
// //                           ),
// //                           const SizedBox(height: 20),
                          
// //                           // Location
// //                           _buildModernTextField(
// //                             controller: _locationController,
// //                             label: 'Location',
// //                             icon: Icons.location_on,
// //                             validator: (value) {
// //                               if (value?.isEmpty ?? true) {
// //                                 return 'Enter location';
// //                               }
// //                               return null;
// //                             },
// //                           ),
// //                           const SizedBox(height: 32),
                          
// //                           _buildSectionTitle('Photo'),
// //                           const SizedBox(height: 16),
                          
// //                           // Photo Section
// //                           _buildPhotoSection(),
// //                           const SizedBox(height: 32),
                          
// //                           _buildSectionTitle('Story'),
// //                           const SizedBox(height: 16),
                          
// //                           // Notes
// //                           _buildModernTextField(
// //                             controller: _notesController,
// //                             label: 'Share your fishing experience...',
// //                             icon: Icons.edit_note,
// //                             maxLines: 4,
// //                           ),
// //                           const SizedBox(height: 32),
                          
// //                           // Submit Button
// //                           _buildSubmitButton(),
// //                         ],
// //                       ),
// //                     ),
// //                   ),
// //                 ),
// //               ),
// //             ],
// //           ),
// //         ),
// //       ),
// //     );
// //   }

// //   Widget _buildSectionTitle(String title) {
// //     return Text(
// //       title,
// //       style: Theme.of(context).textTheme.titleLarge?.copyWith(
// //         fontWeight: FontWeight.bold,
// //         color: Colors.grey.shade800,
// //       ),
// //     );
// //   }

// //   Widget _buildModernDropdown() {
// //     return Container(
// //       decoration: BoxDecoration(
// //         borderRadius: BorderRadius.circular(16),
// //         border: Border.all(color: Colors.grey.shade300),
// //         color: Colors.grey.shade50,
// //       ),
// //       child: DropdownButtonFormField<String>(
// //         value: _species,
// //         decoration: InputDecoration(
// //           labelText: 'Fish Species',
// //           prefixIcon: Icon(Icons.set_meal, color: Colors.orange.shade600),
// //           border: InputBorder.none,
// //           contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
// //           labelStyle: TextStyle(color: Colors.grey.shade600),
// //         ),
// //         items: _fishSpecies.map((species) {
// //           return DropdownMenuItem(
// //             value: species,
// //             child: Text(species),
// //           );
// //         }).toList(),
// //         onChanged: (value) {
// //           setState(() {
// //             _species = value;
// //           });
// //         },
// //         validator: (value) => value == null ? 'Select fish species' : null,
// //         dropdownColor: Colors.white,
// //         style: const TextStyle(color: Colors.black87),
// //       ),
// //     );
// //   }

// //   Widget _buildModernTextField({
// //     required TextEditingController controller,
// //     required String label,
// //     required IconData icon,
// //     String? Function(String?)? validator,
// //     TextInputType? keyboardType,
// //     int maxLines = 1,
// //   }) {
// //     return Container(
// //       decoration: BoxDecoration(
// //         borderRadius: BorderRadius.circular(16),
// //         color: Colors.grey.shade50,
// //         border: Border.all(color: Colors.grey.shade300),
// //       ),
// //       child: TextFormField(
// //         controller: controller,
// //         decoration: InputDecoration(
// //           labelText: label,
// //           prefixIcon: Icon(icon, color: Colors.orange.shade600),
// //           border: InputBorder.none,
// //           contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
// //           labelStyle: TextStyle(color: Colors.grey.shade600),
// //         ),
// //         keyboardType: keyboardType,
// //         maxLines: maxLines,
// //         validator: validator,
// //         style: const TextStyle(color: Colors.black87),
// //       ),
// //     );
// //   }

// //   Widget _buildPhotoSection() {
// //     return GestureDetector(
// //       onTap: _selectPhotoSource,
// //       child: Container(
// //         height: 200,
// //         width: double.infinity,
// //         decoration: BoxDecoration(
// //           color: Colors.grey.shade50,
// //           borderRadius: BorderRadius.circular(16),
// //           border: Border.all(
// //             color: _selectedPhoto != null ? Colors.orange.shade300 : Colors.grey.shade300,
// //             width: _selectedPhoto != null ? 2 : 1,
// //           ),
// //         ),
// //         child: _selectedPhoto != null
// //             ? AnimatedBuilder(
// //                 animation: _photoAnimation,
// //                 builder: (context, child) {
// //                   return Transform.scale(
// //                     scale: _photoAnimation.value,
// //                     child: ClipRRect(
// //                       borderRadius: BorderRadius.circular(14),
// //                       child: Image.file(
// //                         _selectedPhoto!,
// //                         fit: BoxFit.cover,
// //                       ),
// //                     ),
// //                   );
// //                 },
// //               )
// //             : Column(
// //                 mainAxisAlignment: MainAxisAlignment.center,
// //                 children: [
// //                   Icon(
// //                     Icons.add_a_photo,
// //                     size: 48,
// //                     color: Colors.grey.shade400,
// //                   ),
// //                   const SizedBox(height: 12),
// //                   Text(
// //                     'Tap to add photo',
// //                     style: TextStyle(
// //                       color: Colors.grey.shade600,
// //                       fontSize: 16,
// //                       fontWeight: FontWeight.w500,
// //                     ),
// //                   ),
// //                   const SizedBox(height: 4),
// //                   Text(
// //                     'Camera or Gallery',
// //                     style: TextStyle(
// //                       color: Colors.grey.shade500,
// //                       fontSize: 14,
// //                     ),
// //                   ),
// //                 ],
// //               ),
// //       ),
// //     );
// //   }

// //   Widget _buildSubmitButton() {
// //     return Container(
// //       width: double.infinity,
// //       height: 56,
// //       decoration: BoxDecoration(
// //         gradient: LinearGradient(
// //           colors: [Colors.orange.shade500, Colors.cyan.shade500],
// //           begin: Alignment.centerLeft,
// //           end: Alignment.centerRight,
// //         ),
// //         borderRadius: BorderRadius.circular(16),
// //         boxShadow: [
// //           BoxShadow(
// //             color: Colors.orange.shade200,
// //             blurRadius: 8,
// //             offset: const Offset(0, 4),
// //           ),
// //         ],
// //       ),
// //       child: ElevatedButton(
// //         onPressed: _isSubmitting ? null : _submitCatch,
// //         style: ElevatedButton.styleFrom(
// //           backgroundColor: Colors.transparent,
// //           shadowColor: Colors.transparent,
// //           shape: RoundedRectangleBorder(
// //             borderRadius: BorderRadius.circular(16),
// //           ),
// //         ),
// //         child: _isSubmitting
// //             ? const Row(
// //                 mainAxisAlignment: MainAxisAlignment.center,
// //                 children: [
// //                   SizedBox(
// //                     width: 20,
// //                     height: 20,
// //                     child: CircularProgressIndicator(
// //                       valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
// //                       strokeWidth: 2,
// //                     ),
// //                   ),
// //                   SizedBox(width: 12),
// //                   Text(
// //                     'Logging Catch...',
// //                     style: TextStyle(
// //                       color: Colors.white,
// //                       fontSize: 16,
// //                       fontWeight: FontWeight.bold,
// //                     ),
// //                   ),
// //                 ],
// //               )
// //             : const Text(
// //                 'Log Your Catch',
// //                 style: TextStyle(
// //                   color: Colors.white,
// //                   fontSize: 16,
// //                   fontWeight: FontWeight.bold,
// //                 ),
// //               ),
// //       ),
// //     );
// //   }
// // }