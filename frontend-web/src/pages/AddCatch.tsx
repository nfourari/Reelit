import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fish, MapPin, Camera, FileText, Scale, Ruler } from 'lucide-react';

const AddCatch = () => {
  const [formData, setFormData] = useState({
    species: '',
    weight: '',
    length: '',
    location: '',
    notes: '',
    photo: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  // Available fish species
  const fishSpecies = [
    'Largemouth Bass',
    'Smallmouth Bass',
    'Bluegill',
    'Crappie',
    'Catfish',
    'Redfish',
    'Snook',
    'Trout',
    'Tarpon',
    'Peacock Bass'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSpeciesChange = (value) => {
    setFormData({
      ...formData,
      species: value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        photo: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Submitting catch data:', formData);
    alert('Catch logged successfully!');
    // Redirect to dashboard or profile would happen here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-cyan-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Log Your Catch</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-800">Catch Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Fish Species */}
              <div className="space-y-2">
                <Label htmlFor="species" className="text-lg font-medium text-slate-800 flex items-center">
                  <Fish className="w-5 h-5 mr-2 text-primary" />
                  Fish Species
                </Label>
                <Select 
                  value={formData.species} 
                  onValueChange={handleSpeciesChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select fish species" />
                  </SelectTrigger>
                  <SelectContent>
                    {fishSpecies.map((species) => (
                      <SelectItem key={species} value={species}>
                        {species}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Weight & Length */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-lg font-medium text-slate-800 flex items-center">
                    <Scale className="w-5 h-5 mr-2 text-primary" />
                    Weight (lbs)
                  </Label>
                  <Input 
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    placeholder="Enter weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length" className="text-lg font-medium text-slate-800 flex items-center">
                    <Ruler className="w-5 h-5 mr-2 text-primary" />
                    Length (inches)
                  </Label>
                  <Input 
                    id="length"
                    name="length"
                    type="number"
                    step="0.1"
                    placeholder="Enter length"
                    value={formData.length}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-300 rounded-md"
                  />
                </div>
              </div>
              
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-lg font-medium text-slate-800 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  Location
                </Label>
                <Input 
                  id="location"
                  name="location"
                  placeholder="Enter location or map link"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
              </div>
              
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="photo" className="text-lg font-medium text-slate-800 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-primary" />
                  Photo
                </Label>
                <Input 
                  id="photo"
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full p-2 border border-slate-300 rounded-md"
                />
                
                {previewUrl && (
                  <div className="mt-4 rounded-lg overflow-hidden">
                    <img 
                      src={previewUrl} 
                      alt="Catch preview" 
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
              </div>
              
              {/* Notes/Story */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-lg font-medium text-slate-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Notes/Story
                </Label>
                <Textarea 
                  id="notes"
                  name="notes"
                  placeholder="Share your fishing story..."
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-slate-300 rounded-md min-h-[120px]"
                />
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-3 px-4 rounded-md"
              >
                Log Your Catch
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddCatch; 