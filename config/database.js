module.exports=[

		{
	    'environment': 'production',
	    'url'       : 'mongodb://localhost/aspirantdb',
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
