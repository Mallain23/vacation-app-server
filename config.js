exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://mallain23:afrojack22@ds161860.mlab.com:61860/vacation-app';
exports.PORT = process.env.PORT || 8080;

exports.TEST_DATABASE_URL = 'mongodb://mallain23:afrojack22@ds163721.mlab.com:63721/blogdata'

exports.JWT_SECRET = process.env.JWT_SECRET || 'MayTheShadowOfTheMoonFallOnAWorldAtPeace';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

exports.CLIENT_ORIGIN =  process.env.CLIENT_ORIGIN || 'https://designer-tapir-81850.netlify.com/'
