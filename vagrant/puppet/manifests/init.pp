class { 'nodejs': manage_repo => true }
class { 'mongodb::server': }

package { 'nodemon': 
  provider => npm,
  require => Class['nodejs']
}

package { 'mocha': 
  provider => npm,
  require => Class['nodejs']
}

package { 'grunt-cli': 
  provider => npm,
  require => Class['nodejs']
}
