# Realm of Rantarctica - Testing

In order to ensure the desired level of functionality, a rigarous testing program was set out with strict criteria to be met in order to be deemed successful.  Testing was devided into diffirent areas, including responsiveness, cross-browser compatability, acceptable load times and the intended behaviour of site components.

- [Realm of Rantarctica - Testing](#realm-of-rantarctica---testing)
  - [Responsiveness](#responsiveness)
    - [Desired Result](#desired-result)
    - [Steps Taken to Ensure Result](#steps-taken-to-ensure-result)
    - [Verdict](#verdict)
  - [Cross-browser Compatability](#cross-browser-compatability)
    - [Desired Result](#desired-result-1)
    - [Steps Taken to Ensure Result](#steps-taken-to-ensure-result-1)
    - [Verdict](#verdict-1)
  - [Load Times](#load-times)
    - [Desired Result](#desired-result-2)
    - [Steps Taken to Ensure Result](#steps-taken-to-ensure-result-2)
    - [Verdict](#verdict-2)

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

## Cross-browser Compatability

### Desired Result

Display correctly in any browser users are likely to use.

### Steps Taken to Ensure Result

I tested Realm of Rantarctica throroughly using a range of browsers, and where I did not have access to it - such as Safari - I borrowed Apple devices to test for potential bugs.

Browsers tested include:

- Chrome - desktop and mobile
- Firefox - desktop and mobile
- Opera - dekstop
- Opera Mini - mobile
- Brave - desktop and mobile
- DuckDuckGo - mobile

### Verdict

No obvious bugs were detected in any of the tested browsers. Initially, some of the animations did not perform as expected in Opera, but this was quickly rectified by adding the appropriate CSS selectors to the style.css file. Although some browsers handle viewport height and scroll behaviour differently, no obvious cutt-offs were observed.

## Load Times

### Desired Result

Load images within 1.5 seconds regardless of connection speed.

### Steps Taken to Ensure Result

Full screen background images were initially compressed to allow for faster load times, but the loss of quality and definition was so profound that the original high-definition images were used instead.

Where full-screen images were not required, such as on the Select Level screen, smaller images are fetched from Cloudinary to improve load times.

### Verdict

Acceptable load times were experienced at various connection speeds, with the slowest connection tested being 2 Mb/s in a school with limited speeds for students.  Large background images resulted in a noticable delay in loading the page of about two seconds. However, according to feedback from testers, did not affect the gameplay experience once the background has loaded and no further lenghty load times are required.

On the slowest connection tested, music playback also suffered on occasion, though sound effects worked perfectly on any connection speed.
