require 'pathname'

Puppet::Type.newtype(:apt_key) do

  @doc = <<-EOS
    This type provides Puppet with the capabilities to manage GPG keys needed
    by apt to perform package validation. Apt has it's own GPG keyring that can
    be manipulated through the `apt-key` command.

    apt_key { '4BD6EC30':
      source => 'http://apt.puppetlabs.com/pubkey.gpg'
    }

    **Autorequires**:

    If Puppet is given the location of a key file which looks like an absolute
    path this type will autorequire that file.
  EOS

  ensurable

  validate do
    if self[:content] and self[:source]
      fail('The properties content and source are mutually exclusive.')
    end
  end

  newparam(:id, :namevar => true) do
    desc 'The ID of the key you want to manage.'
    # GPG key ID's should be either 32-bit (short) or 64-bit (long) key ID's
    # and may start with the optional 0x
    newvalues(/\A(0x)?[0-9a-fA-F]{8}\Z/, /\A(0x)?[0-9a-fA-F]{16}\Z/)
    munge do |value|
      if value.start_with?('0x')
        id = value.partition('0x').last.upcase
      else
        id = value.upcase
      end
      if id.length == 16
        id[8..-1]
      else
        id
      end
    end
  end

  newparam(:content) do
    desc 'The content of, or string representing, a GPG key.'
  end

  newparam(:source) do
    desc 'Location of a GPG key file, /path/to/file, ftp://, http:// or https://'
    newvalues(/\Ahttps?:\/\//, /\Aftp:\/\//, /\A\/\w+/)
  end

  autorequire(:file) do
    if self[:source] and Pathname.new(self[:source]).absolute?
      self[:source]
    end
  end

  newparam(:server) do
    desc 'The key server to fetch the key from based on the ID.'
    defaultto :'keyserver.ubuntu.com'
    # Need to validate this, preferably through stdlib is_fqdn
    # but still working on getting to that.
  end

  newparam(:keyserver_options) do
    desc 'Additional options to pass to apt-key\'s --keyserver-options.'
  end

  newproperty(:expired) do
    desc <<-EOS
      Indicates if the key has expired.

      This property is read-only.
    EOS
  end

  newproperty(:expiry) do
    desc <<-EOS
      The date the key will expire, or nil if it has no expiry date.

      This property is read-only.
    EOS
  end

  newproperty(:size) do
    desc <<-EOS
      The key size, usually a multiple of 1024.

      This property is read-only.
    EOS
  end

  newproperty(:type) do
    desc <<-EOS
      The key type, either RSA or DSA.

      This property is read-only.
    EOS
  end

  newproperty(:created) do
    desc <<-EOS
      Date the key was created.

      This property is read-only.
    EOS
  end
end
