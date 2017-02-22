module.exports=[
	{
		'environment': 'production',
		'url'       : 'mongodb://desshub:1ncorrect.@ds157459.mlab.com:57459/aspirantdb',
		'secret'    : 'anystringoftext'
	},

	{
    'environment': 'development',
    'url'       : process.env.MONGOLAB_URI,
    'secret'    : 'anystringoftext'
  },

  {
    'environment': 'test',
    'url'       : 'mongodb://localhost/aspirantdb_test',
    'secret'    : 'anystringoftext'
  }
]
