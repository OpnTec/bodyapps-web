# This module provides some helper methods to assist with fixtures. It's
# methods are designed to help when you have a conforming fixture layout so we
# get project consistency.
module PuppetlabsSpec::Fixtures

  # Returns the joined path of the global FIXTURE_DIR plus any path given to it
  def fixtures(*rest)
    File.join(PuppetlabsSpec::FIXTURE_DIR, *rest)
  end

  # Returns the path to your relative fixture dir. So if your spec test is
  # <project>/spec/unit/facter/foo_spec.rb then your relative dir will be
  # <project>/spec/fixture/unit/facter/foo
  def my_fixture_dir
    callers = caller
    while line = callers.shift do
      next unless found = line.match(%r{/spec/(.*)_spec\.rb:})
      return fixtures(found[1])
    end
    fail "sorry, I couldn't work out your path from the caller stack!"
  end

  # Given a name, returns the full path of a file from your relative fixture
  # dir as returned by my_fixture_dir.
  def my_fixture(name)
    file = File.join(my_fixture_dir, name)
    unless File.readable? file then
      fail "fixture '#{name}' for #{my_fixture_dir} is not readable"
    end
    return file
  end

  # Return the contents of the file using read when given a name. Uses
  # my_fixture to work out the relative path.
  def my_fixture_read(name)
    File.read(my_fixture(name))
  end

  # Provides a block mechanism for iterating across the files in your fixture
  # area.
  def my_fixtures(glob = '*', flags = 0)
    files = Dir.glob(File.join(my_fixture_dir, glob), flags)
    unless files.length > 0 then
      fail "fixture '#{glob}' for #{my_fixture_dir} had no files!"
    end
    block_given? and files.each do |file| yield file end
    files
  end
end
