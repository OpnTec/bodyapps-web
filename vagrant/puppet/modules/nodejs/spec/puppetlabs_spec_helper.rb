# Define the main module namespace for use by the helper modules
module PuppetlabsSpec
  # FIXTURE_DIR represents the standard locations of all fixture data. Normally
  # this represents <project>/spec/fixtures. This will be used by the fixtures
  # library to find relative fixture data.
  FIXTURE_DIR = File.join(dir = File.expand_path(File.dirname(__FILE__)), \
    "fixtures") unless defined?(FIXTURE_DIR)
end

# Require all necessary helper libraries so they can be used later
require 'puppetlabs_spec/files'
require 'puppetlabs_spec/fixtures'
require 'puppetlabs_spec/matchers'

RSpec.configure do |config|
  # Include PuppetlabsSpec helpers so they can be called at convenience
  config.extend PuppetlabsSpec::Files
  config.extend PuppetlabsSpec::Fixtures
  config.include PuppetlabsSpec::Fixtures

  # This will cleanup any files that were created with tmpdir or tmpfile
  config.after :each do
    PuppetlabsSpec::Files.cleanup
  end
end
