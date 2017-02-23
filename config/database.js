module.exports=[

		{
	    'environment': 'production',
	    'url'       : process.env.MONGOLAB_URI,
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
