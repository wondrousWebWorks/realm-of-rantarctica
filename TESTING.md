# Realm of Rantarctica - Testing

In order to ensure the desired level of functionality, a rigarous testing program was set out with strict criteria to be met in order to be deemed successful.  Testing was devided into diffirent areas, including responsiveness, cross-browser compatability, acceptable load times and the intended behaviour of site components.

- [Realm of Rantarctica - Testing](#realm-of-rantarctica---testing)
  - [Responsiveness](#responsiveness)
    - [Desired Result](#desired-result)
    - [Steps Taken to Ensure Result](#steps-taken-to-ensure-result)
    - [Verdict](#verdict)

## Responsiveness

### Desired Result

Display correctly on any screen size users are likely to use.

### Steps Taken to Ensure Result

Bootstrap 4 was used extensively when creating Realm of Rantarctica, including its grid system to ensure responsiveness on any screen size.  The decision to create the page to fit on any device screen without the need to scroll on the page created some difficulty in getting it to display correctly.  Scrolling is necessary in some modals and the **Select Battleground** screen, where the CSS *overflow: scroll* property is used to enable scrolling on a portion of the page while the rest of the page remains static.  It also proved necessary to use not only CSS media queries for width as I have done in the past, but for height as well to display the content as intended on mobile devices in both portrait and landscape mode.

Devices tested include, but are not limited to:

- Sony Xperia Xa2
- Samsung J5, S8, S10, Tab S6
- Apple iPhone 6,7 and 10
- Huawei P20, P20 Pro, Mate20 Pro

### Verdict

Realm of Rantarctica adapts to all tested screen sizes and devices and displays as expected.