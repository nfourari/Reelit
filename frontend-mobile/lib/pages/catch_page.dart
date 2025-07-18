import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class AddCatchPage extends StatefulWidget {
  const AddCatchPage({super.key});

  @override
  _AddCatchPageState createState() => _AddCatchPageState();
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
    'Largemouth Bass', 'Smallmouth Bass', 'Bluegill', 'Crappie', 'Catfish',
    'Redfish', 'Snook', 'Trout', 'Tarpon', 'Peacock Bass'
  ];

  Future<void> _pickImage() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (picked != null) setState(() => _photo = File(picked.path));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Log Your Catch')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: 'Fish Species'),
                items: _fishSpecies.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                onChanged: (v) => setState(() => _species = v),
                validator: (v) => v == null ? 'Select species' : null,
              ),
              const SizedBox(height: 12),
              Row(children: [
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
              ]),
              const SizedBox(height: 12),
              TextFormField(
                controller: _locationCtrl,
                decoration: const InputDecoration(labelText: 'Location'),
                validator: (v) => v!.isEmpty ? 'Enter location' : null,
              ),
              const SizedBox(height: 12),
              Text('Photo', style: Theme.of(context).textTheme.titleMedium),
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
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Catch logged!')));
                    }
                  },
                  child: const Text('Log Your Catch'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}