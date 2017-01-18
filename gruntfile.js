module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: "\n\n",
				stripBanners: true,
				banner: '/* <%= pkg.name %> - v<%= pkg.version %> - ' + ' <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n'
			},
			jqboot: {
				src: [
					'assets/js/jquery.min.js', 
					'assets/js/jquery.validate.min.js', 
					'assets/js/bootstrap.min.js',
					'assets/js/bootstrap-datepicker.min.js', 
					'assets/js/locales/bootstrap-datepicker.en-GB.min.js'
					],
				dest: 'assets/js/release/v<%= pkg.version %>/main-jqboot.js'
			},
			userjs: {
				src: [ 
					'assets/js/app.login.js'
					],
				dest: 'assets/js/release/v<%= pkg.version %>/main-user.js'
			},
			chart: {
				src: [
					'assets/js/highcharts.js', 
					'assets/js/exporting.js'
					],
				dest: 'assets/js/release/v<%= pkg.version %>/main-chart.js'
			},
			angular: {
				src: [
					'ng/1-angular.min.js', 
					'ng/2-angular-route.min.js', 
					'ng/packages/ng-table/ng-table.min.js',
					'ng/packages/3-dirPagination.js'
					],
				dest: 'assets/js/release/v<%= pkg.version %>/main-ng.js'				
			},
			controllers: {
				src: [
					'ng/4-route.js', 
					'ng/services/5-myServices.js', 
					'ng/helper/6-myHelper.js',				
					'ng/controllers/*.js'
				],
				dest: 'assets/js/release/dev/v<%= pkg.version %>/main-app.js'
			}
		},
		cssmin: {
		  options: {
		    shorthandCompacting: false,
		    roundingPrecision: -1
		  },
		  css: {
		    files: {
		      'assets/css/app.min.css': ['assets/css/style.css']
		    }
		  }
		},		
		concat_css: {
			options: {
				banner: '/* <%= pkg.name %> - v<%= pkg.version %> - ' + ' <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n'
			},
		    files: {
		    	src: [
		    		'assets/css/font-awesome.min.css', 
		    		'assets/css/bootstrap.min.css', 
		    		'assets/css/bootstrap-datepicker3.min.css', 
		    		'assets/css/app.min.css', 
		    		'ng/packages/ng-table/ng-table.min.css',
		    		'ng/packages/angular-xeditable-0.6.0/css/xeditable.min.css'
		    		],
		    	dest: 'assets/css/main-app.css'
		    }			
		},
		uglify: {
			dist: {
				files: {
					'assets/js/release/v<%= pkg.version %>/main-app.min.js': 'assets/js/release/dev/v<%= pkg.version %>/main-app.js'
				},
				options: {
					banner: '/* <%= pkg.name %> - v<%= pkg.version %> - ' + ' <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n'
				}
			}
		},
		ngAnnotate: {
			options: {
	            singleQuotes: true
	        },
	        dist: {
	        	files: [
	        		{
	                    expand: true,
	                    src: [
	                    	'ng/controllers/*.js',
	                    	'ng/services/5-myServices.js',
	                    	'ng/4-route.js'
	                    ]     
	        		}
                ]
	        }
		},
		jsbeautifier : {
		    default: {
		        src : ['ng/controllers/*.js', 'assets/js/release/v<%= pkg.version %>/main-app.js'],
		        options : {
		            js: {
		                indentSize: 4
		            }
		        }
		    }
		},		
		watch: {
			script: {
				files: [
					'ng/controllers/*.js',
					'ng/4-route.js',
					'ng/services/5-myServices.js',
					'assets/js/app.js'
				],
				tasks: ['concat',
						'ngAnnotate',
						'jsbeautifier',
						'uglify']
			},
			css: {
				files: ['assets/css/style.css'],
				tasks: ['cssmin','concat_css']				
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-concat-css');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks("grunt-jsbeautifier");

	grunt.registerTask('default', ['build']);
	grunt.registerTask('partial', 'Build Partial', ['css', 'scripts']);
	grunt.registerTask('css', 'Build CSS', ['cssmin', 'concat_css']);
	grunt.registerTask('scripts', 'Build the Scripts', 
		[
		'concat:angular',
		'concat:controllers',
		'ngAnnotate',
		'jsbeautifier',
		'uglify'
		]
	);
	grunt.registerTask('build', 'Build the Application', 
		[
		'concat',
		'cssmin',
		'concat_css',
		'ngAnnotate',
		'jsbeautifier',
		'uglify'
		]
	);
};