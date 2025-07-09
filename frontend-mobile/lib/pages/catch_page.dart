import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class AddCatchPage extends StatefulWidget {
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
      appBar: AppBar(title: Text('Log Your Catch')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              DropdownButtonFormField<String>(
                decoration: InputDecoration(labelText: 'Fish Species'),
                items: _fishSpecies.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                onChanged: (v) => setState(() => _species = v),
                validator: (v) => v == null ? 'Select species' : null,
              ),
              SizedBox(height: 12),
              Row(children: [
                Expanded(
                  child: TextFormField(
                    controller: _weightCtrl,
                    decoration: InputDecoration(labelText: 'Weight (lbs)'),
                    keyboardType: TextInputType.number,
                    validator: (v) => v!.isEmpty ? 'Enter weight' : null,
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: TextFormField(
                    controller: _lengthCtrl,
                    decoration: InputDecoration(labelText: 'Length (in)'),
                    keyboardType: TextInputType.number,
                    validator: (v) => v!.isEmpty ? 'Enter length' : null,
                  ),
                ),
              ]),
              SizedBox(height: 12),
              TextFormField(
                controller: _locationCtrl,
                decoration: InputDecoration(labelText: 'Location'),
                validator: (v) => v!.isEmpty ? 'Enter location' : null,
              ),
              SizedBox(height: 12),
              Text('Photo', style: Theme.of(context).textTheme.titleMedium),
              SizedBox(height: 8),
              GestureDetector(
                onTap: _pickImage,
                child: Container(
                  height: 200,
                  width: double.infinity,
                  color: Colors.grey[200],
                  child: _photo != null
                      ? Image.file(_photo!, fit: BoxFit.cover)
                      : Icon(Icons.camera_alt, size: 50, color: Colors.grey),
                ),
              ),
              SizedBox(height: 12),
              TextFormField(
                controller: _notesCtrl,
                decoration: InputDecoration(labelText: 'Notes/Story'),
                maxLines: 4,
              ),
              SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Catch logged!')));
                    }
                  },
                  child: Text('Log Your Catch'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}