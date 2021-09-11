# Test Debug Project for capacitor-data-storage-sqlite
Start by running 

```
npm i
ionic capacitor add ios
ionic capacitor open ios
```

Then in xcode select the project browser (folder on top left) > Select App > Navigate to Signing & Capabilities > Add your team info

Then run the app using:
```
npm run ios-serve
```

Inspect the debug window using Safari > Develop > Select iOS device > Select the running app and go to debug console.
# Install
Begin by installing the required tools.

```
npm install
```
# Running
Run on web for local testing:
```
npm run serve
```

Run on iOS remote debugging:
```
npm run ios-serve
```

Sync ionic and capacitor plugins with iOS:
```
npm run sync
```

Deploy to production device:
```
npm run deploy
```# capacitor-data-storage-sqlite-debug-project
