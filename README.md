<a href="https://luehangs.site"><img src="https://luehangs.site/images/lh-blog-strip.jpg" alt="LueHsoft LueH LABS Lue Hang luehang"/></a>
<br/>
<br/>

<h1 align="center">
    React Native Swipe Render
</h1>

An easy and simple to use React Native component that renders swipable performant pages for large lists or content.  Supporting both iOS and Android.  Check out the [docs](https://www.luehangs.site/lue_hang/projects/react-native-swipe-render).

- Supports smart or minimal rendering for **large lists**.
- Supports two ways of rendering contents. Render using function and data or render React.Element children.
- Horizontal and vertical paging for both Android and iOS.
- Initial index can be placed anywhere. Supporting both Android and iOS.
- Dynamic index support for iOS.
- Optional slide looping.
- Optional automatic slides.
- Optional alternative usage with Android `ScrollView` instead of `ViewPagerAndroid`.
- Supports both iOS and Android.

<br/>

---
<br/>

<h1 align="center">
    <a href="https://www.luehangs.site/lue_hang/projects/react-native-swipe-render">
        <img src="https://www.luehangs.site/videos/react-native-swipe-render-demo.gif" alt="react-native-swipe-render"/>
    </a>
</h1>

<br/>
<br/>

# :link: Quick Links
- [Documentation](https://www.luehangs.site/lue_hang/projects/react-native-swipe-render)
- [Mobile Kit Marketplace](https://luehangs.site/marketplace/mobile-development)
- [React Native Development How To Dos](https://luehangs.site/blogs/react-native-development)
- [Chat](https://luehangs.site)

<br/>

---
<br/>

# :gem: Install

Type in the following to the command line to install the module.

```bash
$ npm install --save react-native-swipe-render
```

or

```bash
$ yarn add react-native-swipe-render
```

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :tada: Usage Example One

Add an ``import`` to the top of the file.  At minimal, place `array` data into the `data` prop and render the pages using the `renderItem` prop.

> If you like [`react-native-swipe-render`](https://github.com/Luehang/react-native-swipe-render), please be sure to give it a star at [GitHub](https://github.com/Luehang/react-native-swipe-render). Thanks.

```javascript
import SwipeRender from "react-native-swipe-render";
import { View, Image } from "react-native";

//...
render() {
    return (
        <SwipeRender
            data={[
                { uri: "https://luehangs.site/pic-chat-app-images/pexels-photo-853168.jpeg" },
                { uri: "https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg" },
                { uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg" },
                { uri: "https://luehangs.site/pic-chat-app-images/photo-755745.jpeg" },
                { uri: "https://luehangs.site/pic-chat-app-images/photo-799443.jpeg" }
            ]}
            renderItem={({ item, index }) => {
                return (
                    <View key={"SwipeRender-slide#" + index} style={{flex: 1, backgroundColor: "#000"}}>
                        <Image
                            source={{ uri: item.uri }}
                            style={{flex: 1}}
                            resizeMode="contain"
                        />
                    </View>
                );
            }}

            // OPTIONAL PROP USAGE.
            index={0} // default 0
            loop={false} // default false
            loadMinimal={true} // default false
            loadMinimalSize={2}
            horizontal={true} // default true

            enableAndroidViewPager={false} // default ScrollView
            // TO ENABLE AndroidViewPager:
            // react-native >= 0.60 - install @react-native-community/viewpager separately
            // react-native < 0.60 - ready to go!
        />
    );
}
//...
```

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :tada: Usage Example Two

Add an ``import`` to the top of the file.  At minimal, wrap any view in the `<SwipeRender></SwipeRender>`.

> If you like [`react-native-swipe-render`](https://github.com/Luehang/react-native-swipe-render), please be sure to give it a star at [GitHub](https://github.com/Luehang/react-native-swipe-render). Thanks.

```javascript
import SwipeRender from "react-native-swipe-render";
import { View, Image, Text } from "react-native";

//...
render() {
    return (
        <SwipeRender
            // OPTIONAL PROP USAGE.
            index={0} // default 0
            loop={false} // default false
            loadMinimal={true} // default false
            loadMinimalSize={2}
            horizontal={true} // default true

            enableAndroidViewPager={false} // default ScrollView
            // TO ENABLE AndroidViewPager:
            // react-native >= 0.60 - install @react-native-community/viewpager separately
            // react-native < 0.60 - ready to go!
        >
            <View style={{flex: 1, backgroundColor: "#000"}}>
                <Image
                    source={{ uri: "https://luehangs.site/pic-chat-app-images/pexels-photo-853168.jpeg" }}
                    style={{flex: 1}}
                    resizeMode="contain"
                />
            </View>
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={{color: "blue", fontSize: 25, fontWeight: "bold"}}>
                    Any kind of View
                </Text>
            </View>
            <View style={{flex: 1, backgroundColor: "#000"}}>
                <Image
                    source={{ uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg" }}
                    style={{flex: 1}}
                    resizeMode="contain"
                />
            </View>
        </SwipeRender>
    );
}
//...
```

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :watch: Performance Optimization List Example

> If you like [`react-native-swipe-render`](https://github.com/Luehang/react-native-swipe-render), please be sure to give it a star at [GitHub](https://github.com/Luehang/react-native-swipe-render). Thanks.

```javascript
import SwipeRender from "react-native-swipe-render";
import { View, Image } from "react-native";

//...
render() {
    return (
        <SwipeRender
            data={[
                { uri: "https://luehangs.site/pic-chat-app-images/pexels-photo-853168.jpeg" },
                { uri: "https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg" },
                { uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg" },
                { uri: "https://luehangs.site/pic-chat-app-images/photo-755745.jpeg" },
                { uri: "https://luehangs.site/pic-chat-app-images/photo-799443.jpeg" },
                // Test with 100s to 1000s of data to be rendered
                // ...
                // ...
                // ...
            ]}
            renderItem={({ item, index }) => {
                return (
                    <View key={index} style={{flex: 1, backgroundColor: "#000"}}>
                        <Image
                            source={{ uri: item.uri }}
                            style={{flex: 1}}
                            resizeMode="contain"
                        />
                    </View>
                );
            }}
            index={3} // Initial index can be placed anywhere.  Dynamic index support for only iOS.
            loadMinimal={true}
            loadMinimalSize={2}
            removeClippedSubviews={true}
        />
    );
}
//...
```

<br/>

---
<br/>

# :book: Full Documentation

Learn more about the installation and how to use this package in the updated [documentation](https://www.luehangs.site/lue_hang/projects/react-native-swipe-render) page.

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :clap: Contribute

[Pull requests](https://github.com/Luehang/react-native-swipe-render/pulls) are welcomed.

<br/>

### :tophat: Contributors

Contributors will be posted here.

<br/>

### :baby: Beginners

Not sure where to start, or a beginner? Take a look at the [issues page](https://github.com/Luehang/react-native-swipe-render/issues).

<br/>
<br/>
<a href="https://luehangs.site/marketplace/product/RN%20Posting%20Demo%20App%20Kit"><img src="https://luehangs.site/images/lh-mobile-strip.jpg" alt="LueHsoft LueH LABS Lue Hang luehang"/></a>
<br/>
<br/>

## :page_facing_up: License

MIT © [Lue Hang](https://luehangs.site), as found in the LICENSE file.
