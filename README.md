POI
===
> point of the interest

Places markers on leaflet driven map based on photo's EXIF data

Uses Sinatra(as JSON API) and Backbone Marionette

## Getting this Working on Your Computer

1. Download this repository.

2. Install the gems.

        $ bundle install

3. Create databases

        $ rake db:create:all

4. Perform db migrations

        $ rake db:migrate
  or
        
        $ rake db:migrate RACK_ENV=test

5. Install Node.js modules

        $ npm install

6. Run default grunt tasks

        $ grunt

7. To run the app, use the following command:

        $ rackup
  or
        
        $ thin start
