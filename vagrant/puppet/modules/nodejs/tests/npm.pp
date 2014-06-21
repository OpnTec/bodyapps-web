include 'nodejs'

nodejs::npm { '/tmp/npm:express':
  ensure  => present,
  version => '2.5.9',
}
