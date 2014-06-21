require 'spec_helper'

describe 'nodejs', :type => :class do

  describe 'input validation' do
    let :facts  do { :operatingsystem => 'Debian' } end
    let :params do {} end
    it 'when deploying on an unsupported os' do
      facts.merge!({:operatingsystem => 'SparklePony'})
      params.merge!({:dev_package => true, :manage_repo => true })
       expect { subject }.to raise_error(Puppet::Error, /Class nodejs does not support SparklePony/)
    end
    ['dev_package','manage_repo'].each do |boolz|
      it "should fail when #{boolz} is not a boolean" do
        facts.merge!({:osfamily => 'Debian'})
        params.merge!({boolz => 'BOGON'})
        expect { subject }.to raise_error(Puppet::Error, /"BOGON" is not a boolean.  It looks to be a String/)
      end
    end
  end
  describe 'when deploying on debian' do
    let :facts do
      {
        :osfamily => 'Debian',
        :operatingsystem => 'Debian',
        :lsbdistcodename => 'wheezy',
        :lsbdistid => 'Debian',
      }
    end
    let :params do
      { :dev_package => true, :manage_repo => true }
    end
    context 'when manage_repo is true' do
      it { should contain_class('apt') }
      it 'should contain the apt source' do
        should contain_apt__source('sid').with({
          'location' => 'http://ftp.us.debian.org/debian/',
        })
      end
    end
    context 'when manage_repo is false' do
      it 'should not contain the apt source' do
        params.merge!({:manage_repo => false})
        should_not contain_apt__source('sid')
      end
    end
    it { should contain_package('nodejs').with({
      'name'    => 'nodejs',
      'require' => 'Anchor[nodejs::repo]',
      'ensure'  => 'present',
    }) }
    it { should contain_package('npm').with({
      'name'    => 'npm',
      'require' => 'Anchor[nodejs::repo]',
    }) }
    it { should_not contain_package('nodejs-stable-release') }
  end

  describe 'when deploying on ubuntu' do
    let :facts do
      {
        :operatingsystem => 'Ubuntu',
        :osfamily        => 'Debian',
        :lsbdistcodename => 'trusty',
        :lsbdistid       => 'Ubuntu',
      }
    end

    let :params do
      { :dev_package => true, :manage_repo => true }
    end
    context 'when manage_repo is true' do
      it { should contain_class('apt') }
      it { should contain_apt__ppa('ppa:chris-lea/node.js') }
    end
    context 'when manage_repo is false' do
      it 'should not create the ppa' do
        params.merge!({:manage_repo => false})
        should_not contain_class('apt')
        should_not contain_apt__ppa('ppa:chris-lea/node.js')
      end
    end

    it { should contain_class('apt') }
    it { should contain_apt__ppa('ppa:chris-lea/node.js') }
    it { should contain_apt__ppa('ppa:chris-lea/node.js-devel') }
    it { should contain_package('nodejs') }
    it { should contain_package('nodejs').with({
      'name'    => 'nodejs',
      'require' => 'Anchor[nodejs::repo]',
    }) }
    it { should contain_package('nodejs-dev') }
    it { should_not contain_package('npm') }
    it { should_not contain_package('nodejs-stable-release') }
  end

  { 'Redhat' => 'el$releasever',
    'Scientific' => 'el$releasever',
    'CentOS' => 'el$releasever'
  }.each do |os, repo|
    { '5' => 'nodejs-compat-symlinks',
      '6' => 'nodejs'
    }.each do |major, package|
      describe "when deploying on (#{os}) #{major}" do
        let :facts do
          { :operatingsystem => os,
            :operatingsystemrelease => "#{major}.4",
            :lsbmajdisrelease => major
          }
        end

        let :params do
          { :dev_package => true,:manage_repo => true}
        end

        context 'when manage_repo is true' do
          it 'should remove the node-js-stable-release package' do
            should contain_package('nodejs-stable-release').with({
              'ensure' => 'absent',
            })
          end
          it 'should add the nodejs-stable yumrepo' do
            should contain_yumrepo('nodejs-stable').with({
              'baseurl'  => "http://patches.fedorapeople.org/oldnode/stable/#{repo}/$basearch/",
              'before'   => 'Anchor[nodejs::repo]',
            })
          end
          it 'should add the yumrepo file resource' do
            should contain_file('nodejs_repofile')
          end
        end
        context 'when manage_repo is false' do
          let (:params) {{:manage_repo => false}}
          it 'should not remove the nodejs-stable-release package if present' do
            should_not contain_package('nodejs-stable-release')
          end
          it 'should not contain the yumrepo' do
            should_not contain_yumrepo('nodejs-stable')
          end
          it 'should not contain the yumrepo file' do
            should_not contain_file('nodejs_repofile')
          end
        end
        it { should contain_package('nodejs').with({
          'name'    => package,
          'require' => 'Anchor[nodejs::repo]',
        }) }
        it { should contain_package('npm').with({
          'name'    => 'npm',
          'require' => 'Anchor[nodejs::repo]',
        }) }
        it { should_not contain_package('nodejs-dev') }
      end
    end
  end
  { 'Fedora' => 'f$releasever',
    'Amazon' => 'amzn1'
  }.each do |os, repo|
    describe "when deploying on (#{os})" do
      let :facts do
        { :operatingsystem => os,
        }
      end
      let :params do
        { :dev_package => true,:manage_repo => true }
      end
      context 'when manage_repo is true' do
        it 'should remove the node-js-stable-release package' do
          should contain_package('nodejs-stable-release').with({
            'ensure' => 'absent',
          })
        end
        it 'should add the nodejs-stable yumrepo' do
          should contain_yumrepo('nodejs-stable').with({
            'baseurl'  => "http://patches.fedorapeople.org/oldnode/stable/#{repo}/$basearch/",
            'before'   => 'Anchor[nodejs::repo]',
          })
        end
        it 'should contain the yumrepo file' do
          should contain_file('nodejs_repofile')
        end
      end

      context 'when manage_repo is false' do
        let (:params) {{:manage_repo => false}}
        it 'should not remove the nodejs-stable-release package if present' do
          should_not contain_package('nodejs-stable-release')
        end
        it 'should not contain the yumrepo' do
          should_not contain_yumrepo('nodejs-stable')
        end
        it 'should not contain the yumrepo file' do
          should_not contain_file('nodejs_repofile')
        end
      end

      it { should contain_package('nodejs').with({
        'require' => 'Anchor[nodejs::repo]',
      }) }
      it { should contain_package('npm').with({
        'name'    => 'npm',
        'require' => 'Anchor[nodejs::repo]',
      }) }
      it { should_not contain_package('nodejs-dev') }
    end
  end


  describe 'when deploying with proxy' do
    let :facts do
      {
        :operatingsystem => 'Ubuntu',
        :lsbdistcodename => 'edgy',
        :lsbdistid       => 'Ubuntu',
      }
    end

    let :params do
      { :proxy => 'http://proxy.puppetlabs.lan:80/' }
    end

    it { should_not contain_package('npm') }
    it { should contain_exec('npm_proxy').with({
      'command' => 'npm config set proxy http://proxy.puppetlabs.lan:80/',
      'require' => 'Package[npm]',
    }) }
    it { should_not contain_package('nodejs-stable-release') }
  end

  describe 'when deploying with version' do
    let :facts do
      {
        :operatingsystem => 'Ubuntu',
        :lsbdistcodename => 'edgy',
        :lsbdistid       => 'Ubuntu',
      }
    end

    let :params do
      { :version => '0.8.16-1chl1~precise1' }
    end

    it { should contain_package('nodejs').with({
      'name'    => 'nodejs',
      'ensure' => '0.8.16-1chl1~precise1',
    }) }

  end

  describe 'when deploying on gentoo' do
    let :facts do
      {
        :operatingsystem => 'Gentoo',
      }
    end

    it { should contain_package_use('net-libs/nodejs').with({
      'ensure'  => 'present',
      'use'     => 'npm',
      'require' => 'Anchor[nodejs::repo]',
    }) }
    it { should contain_package('nodejs').with({
      'ensure'  => 'present',
      'name'    => 'net-libs/nodejs',
      'require' => 'Anchor[nodejs::repo]',
    }) }
  end
end

