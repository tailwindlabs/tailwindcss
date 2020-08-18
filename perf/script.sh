# Cleanup existing perf stuff
rm isolate-*.log

# Ensure we use the latest build version
npm run babelify

# Run Tailwind on the big fixture file & profile it
node --prof lib/cli.js build ./perf/fixture.css -c ./perf/tailwind.config.js -o ./perf/output.css

# Generate flame graph
node --prof-process --preprocess -j isolate*.log > ./perf/v8.json

# Now visit: https://mapbox.github.io/flamebearer/
# And drag that v8.json file in there!
# You can put "./lib" in the search box which will highlight all our code in green.