module.exports=[

		{
	    'environment': 'production',
	    'url'       : 'mongodb://desshub:1ncorrect.@ds157459.mlab.com:57459/aspirantdb',
	    'secret'    : 'anystringoftext'
	  },

	{
		'environment': 'development',
		'url'       : 'mongodb://localhost/aspirantdb',
		'secret'    : 'anystringoftext'
	},

  {
    'environment': 'test',
    'url'       : 'mongodb://localhost/aspirantdb_test',
    'secret'    : 'anystringoftext'
  }
]
