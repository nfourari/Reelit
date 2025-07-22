import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';

class AddCatchPage extends StatefulWidget {
  const AddCatchPage({super.key});

  @override
  State<AddCatchPage> createState() => _AddCatchPageState();
}

class _AddCatchPageState extends State<AddCatchPage> {
  final _formKey = GlobalKey<FormState>();
  String? _species;
  final _weightCtrl = TextEditingController();
  final _lengthCtrl = TextEditingController();
  final _locationCtrl = TextEditingController();
  final _notesCtrl = TextEditingController();
  File? _photo;

  final List<String> _fishSpecies = [
    'Largemouth Bass',
    'Smallmouth Bass',
    'Bluegill',
    'Crappie',
    'Catfish',
    'Redfish',
    'Snook',
    'Trout',
    'Tarpon',
    'Peacock Bass',
  ];

  Future<void> _pickImage() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (picked != null) {
      setState(() => _photo = File(picked.path));
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final api = context.read<ApiService>();
    try {
      await api.addCatch(
        species: _species!,
        weight: double.parse(_weightCtrl.text),
        length: double.parse(_lengthCtrl.text),
        location: _locationCtrl.text,
        comment: _notesCtrl.text,
        photo: _photo,
      );
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Catch logged successfully!')),
      );
      Navigator.pushNamedAndRemoveUntil(
        context,
        '/dashboard',
        (route) => false,
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error logging catch: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Log Your Catch')),
      body: Container(
        constraints: const BoxConstraints.expand(),
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFFF3E0), Color(0xFFE0F7FA)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  DropdownButtonFormField<String>(
                    decoration: const InputDecoration(labelText: 'Fish Species'),
                    items: _fishSpecies
                        .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                        .toList(),
                    onChanged: (v) => setState(() => _species = v),
                    validator: (v) => v == null ? 'Select species' : null,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _weightCtrl,
                          decoration: const InputDecoration(labelText: 'Weight (lbs)'),
                          keyboardType: TextInputType.number,
                          validator: (v) => v!.isEmpty ? 'Enter weight' : null,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: TextFormField(
                          controller: _lengthCtrl,
                          decoration: const InputDecoration(labelText: 'Length (in)'),
                          keyboardType: TextInputType.number,
                          validator: (v) => v!.isEmpty ? 'Enter length' : null,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _locationCtrl,
                    decoration: const InputDecoration(labelText: 'Location'),
                    validator: (v) => v!.isEmpty ? 'Enter location' : null,
                  ),
                  const SizedBox(height: 12),
                  Text('Photo', style: theme.textTheme.titleMedium),
                  const SizedBox(height: 8),
                  GestureDetector(
                    onTap: _pickImage,
                    child: Container(
                      height: 200,
                      width: double.infinity,
                      color: Colors.grey[200],
                      child: _photo != null
                          ? Image.file(_photo!, fit: BoxFit.cover)
                          : const Icon(Icons.camera_alt, size: 50, color: Colors.grey),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _notesCtrl,
                    decoration: const InputDecoration(labelText: 'Notes/Story'),
                    maxLines: 4,
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _submit,
                      child: const Text('Log Your Catch'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
