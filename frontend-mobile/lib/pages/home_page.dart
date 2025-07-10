import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Navigation Bar
            Container(
              padding: EdgeInsets.symmetric(horizontal: 16),
              height: 60,
              color: Colors.white.withOpacity(0.9),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [theme.primaryColor, theme.colorScheme.secondary],
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(Icons.park, color: Colors.white, size: 20),
                    ),
                    SizedBox(width: 8),
                    Text(
                      'Shuzzy+',
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        foreground: Paint()
                          ..shader = LinearGradient(
                            colors: [theme.primaryColor, theme.colorScheme.secondary],
                          ).createShader(Rect.fromLTWH(0, 0, 200, 0)),
                      ),
                    ),
                  ]),
                  Row(children: [
                    TextButton.icon(
                      onPressed: () => Navigator.pushNamed(context, '/login'),
                      icon: Icon(Icons.login, color: Colors.grey[700]),
                      label: Text('Log In', style: TextStyle(color: Colors.grey[700])),
                    ),
                    SizedBox(width: 8),
                    ElevatedButton.icon(
                      onPressed: () => Navigator.pushNamed(context, '/signup'),
                      icon: Icon(Icons.add),
                      label: Text('Sign Up'),
                      style: ElevatedButton.styleFrom(
                        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                    ),
                  ]),
                ],
              ),
            ),

            // Hero Section
            Container(
              height: MediaQuery.of(context).size.height * 0.8,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                    fit: BoxFit.cover,
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.orange.shade900.withOpacity(0.4),
                          Colors.pink.shade800.withOpacity(0.3),
                          Colors.cyan.shade900.withOpacity(0.5),
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),
                  Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 24),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            'Find Your Next',
                            style: theme.textTheme.headlineLarge
                                ?.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
                            textAlign: TextAlign.center,
                          ),
                          ShaderMask(
                            shaderCallback: (rect) => LinearGradient(
                              colors: [Colors.orange.shade200, Colors.cyan.shade200],
                            ).createShader(rect),
                            blendMode: BlendMode.srcIn,
                            child: Text(
                              'Florida Trophy',
                              style: theme.textTheme.headlineLarge
                                  ?.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
                              textAlign: TextAlign.center,
                            ),
                          ),
                          SizedBox(height: 16),
                          Text(
                            'Discover Orlando’s best fishing spots, from Lake Apopka to the Butler Chain of Lakes',
                            style: theme.textTheme.titleMedium
                                ?.copyWith(color: Colors.orange.shade100, fontSize: 18),
                            textAlign: TextAlign.center,
                          ),
                          SizedBox(height: 24),
                          Wrap(
                            spacing: 16,
                            runSpacing: 16,
                            alignment: WrapAlignment.center,
                            children: [
                              ElevatedButton.icon(
                                onPressed: () => Navigator.pushNamed(context, '/map'),
                                icon: Icon(Icons.map),
                                label: Text('Explore Florida Spots'),
                                style: ElevatedButton.styleFrom(
                                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                ),
                              ),
                              OutlinedButton.icon(
                                onPressed: () {}, // hook up your action
                                icon: Icon(Icons.park),
                                label: Text('Join Florida Anglers'),
                                style: OutlinedButton.styleFrom(
                                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                                  side: BorderSide(color: Colors.white30),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                ).copyWith(
                                  foregroundColor: MaterialStateProperty.all(Colors.white),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Features Section
            Container(
              width: double.infinity,
              color: Colors.white,
              padding: EdgeInsets.symmetric(vertical: 40, horizontal: 16),
              child: Column(
                children: [
                  Text(
                    'Everything You Need to Fish Florida Waters',
                    style: theme.textTheme.headlineLarge,
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 12),
                  Text(
                    'From Orlando’s hidden gems to Central Florida lakes, discover the best fishing with local expertise',
                    style: theme.textTheme.titleMedium,
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 32),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    padding: EdgeInsets.symmetric(horizontal: 8),
                    child: Row(
                      children: [
                        _featureCard(
                          icon: Icons.map,
                          title: 'Florida Fishing Spots',
                          description:
                              'Discover Orlando lakes, Kissimmee Chain, and secret spots with GPS coordinates and tips',
                          theme: theme,
                        ),
                        SizedBox(width: 16),
                        _featureCard(
                          icon: Icons.fish,
                          title: 'Log Your Bass & Snook',
                          description:
                              'Track your catches from largemouth bass to snook, build your trophy log',
                          theme: theme,
                        ),
                        SizedBox(width: 16),
                        _featureCard(
                          icon: Icons.wb_sunny,
                          title: 'Florida Weather & Tides',
                          description:
                              'Get Orlando weather updates, tide charts, and best fishing times',
                          theme: theme,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Community Section
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [Color(0xFFFFF3E0), Color(0xFFE0F7FA)]),
              ),
              padding: EdgeInsets.symmetric(vertical: 40, horizontal: 16),
              child: Column(
                children: [
                  Text(
                    'Recent Florida Catches',
                    style: theme.textTheme.headlineLarge,
                  ),
                  SizedBox(height: 12),
                  Text(
                    'See what Orlando anglers are catching this week',
                    style: theme.textTheme.titleMedium,
                  ),
                  SizedBox(height: 32),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _catchCard(
                          angler: 'Carlos M.',
                          fish: 'Largemouth Bass',
                          weight: '8.2 lbs',
                          location: 'Lake Tohopekaliga',
                          time: '2 hours ago',
                          theme: theme,
                        ),
                        SizedBox(width: 16),
                        _catchCard(
                          angler: 'Maria S.',
                          fish: 'Snook',
                          weight: '12.5 lbs',
                          location: 'Mosquito Lagoon',
                          time: '4 hours ago',
                          theme: theme,
                        ),
                        SizedBox(width: 16),
                        _catchCard(
                          angler: 'Tommy J.',
                          fish: 'Redfish',
                          weight: '6.8 lbs',
                          location: 'Indian River',
                          time: '1 day ago',
                          theme: theme,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // CTA Section
            Container(
              width: double.infinity,
              color: theme.primaryColor,
              padding: EdgeInsets.symmetric(vertical: 40, horizontal: 16),
              child: Column(
                children: [
                  Text(
                    'Ready to Explore Florida Waters?',
                    style: theme.textTheme.headlineLarge?.copyWith(color: Colors.white),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 12),
                  Text(
                    'Join Orlando’s fishing community and discover hidden gems',
                    style: theme.textTheme.titleMedium?.copyWith(color: Colors.orange.shade100),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 24),
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 16,
                    runSpacing: 16,
                    children: [
                      ElevatedButton.icon(
                        onPressed: () => Navigator.pushNamed(context, '/signup'),
                        icon: Icon(Icons.park),
                        label: Text('Start Fishing Florida'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: theme.primaryColor,
                          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                        ),
                      ),
                      OutlinedButton.icon(
                        onPressed: () => Navigator.pushNamed(context, '/map'),
                        icon: Icon(Icons.map),
                        label: Text('Explore Orlando Spots'),
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.white30),
                          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                        ).copyWith(
                          foregroundColor: MaterialStateProperty.all(Colors.white),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Footer
            Container(
              color: Colors.grey.shade800,
              padding: EdgeInsets.symmetric(vertical: 24, horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [theme.primaryColor, theme.colorScheme.secondary],
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(Icons.park, color: Colors.white, size: 20),
                    ),
                    SizedBox(width: 8),
                    Text(
                      'Shuzzy+',
                      style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                  ]),
                  SizedBox(height: 8),
                  Text(
                    'Orlando’s premier fishing app for discovering Central Florida’s best spots.',
                    style: TextStyle(color: Colors.grey.shade400),
                  ),
                  SizedBox(height: 16),
                  Wrap(
                    spacing: 32,
                    children: [
                      _footerLinks('Quick Links', ['About', 'Features', 'Community', 'Contact']),
                      _footerLinks('Legal', ['Privacy Policy', 'Terms of Service', 'GitHub']),
                    ],
                  ),
                  SizedBox(height: 16),
                  Center(
                    child: Text(
                      '© 2024 Shuzzy+. All rights reserved.',
                      style: TextStyle(color: Colors.grey.shade400),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _featureCard({
    required IconData icon,
    required String title,
    required String description,
    required ThemeData theme,
  }) =>
      Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Container(
          width: 240,
          padding: EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  gradient: LinearGradient(colors: [theme.primaryColor, theme.colorScheme.secondary]),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: Colors.white, size: 32),
              ),
              SizedBox(height: 16),
              Text(
                title,
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 8),
              Text(
                description,
                style: theme.textTheme.bodyMedium,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );

  Widget _catchCard({
    required String angler,
    required String fish,
    required String weight,
    required String location,
    required String time,
    required ThemeData theme,
  }) =>
      Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Container(
          width: 200,
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Row(children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(colors: [theme.primaryColor, theme.colorScheme.secondary]),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.person, color: Colors.white, size: 20),
                  ),
                  SizedBox(width: 8),
                  Text(
                    angler,
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                  ),
                ]),
                Text(
                  time,
                  style: TextStyle(color: Colors.orange.shade700, fontSize: 12),
                ),
              ]),
              Divider(height: 24, thickness: 1),
              _detailRow('Species', fish),
              _detailRow('Weight', weight, valueColor: theme.primaryColor),
              _detailRow('Location', location),
            ],
          ),
        ),
      );

  Widget _detailRow(String label, String value, {Color? valueColor}) => Padding(
        padding: EdgeInsets.symmetric(vertical: 4),
        child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(label, style: TextStyle(color: Colors.grey[600])),
          Text(value, style: TextStyle(fontWeight: FontWeight.bold, color: valueColor ?? Colors.black)),
        ]),
      );

  Widget _footerLinks(String heading, List<String> links) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(heading, style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          SizedBox(height: 8),
          for (var link in links)
            Padding(
              padding: EdgeInsets.symmetric(vertical: 2),
              child: GestureDetector(
                onTap: () {},
                child: Text(link, style: TextStyle(color: Colors.grey.shade400, decoration: TextDecoration.underline)),
              ),
            ),
        ],
      );
}
