import React from "react";
import {
    Platform,
    Dimensions,
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    Image,
    Linking
} from "react-native";
import PropTypes from "prop-types";
import SwipeRender from "react-native-swipe-render";

import testData from "./data";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;

class Footer extends React.PureComponent {
    static propTypes = {
        renderPageFooter: PropTypes.func
    }

    render() {
        const { renderPageFooter } = this.props;
        const footer = renderPageFooter
            ? renderPageFooter()
            : undefined;
        return (
            <View style={{ bottom: 0, width: "100%", position: "absolute", zIndex: 1000 }}>
                { footer }
            </View>
        );
    }
}

class Header extends React.PureComponent {
    static propTypes = {
        renderPageHeader: PropTypes.func
    }

    render() {
        const { renderPageHeader } = this.props;
        const header = this.props.renderPageHeader
            ? renderPageHeader()
            : undefined;
        return (
            <View style={{ top: 0, width: "100%", position: "absolute", zIndex: 1000 }}>
                { header }
            </View>
        );
    }
}

export default class ReactNativeSwipeRenderExample extends React.PureComponent {
    render() {
        console.log("Data length total: ", testData.length);
        return (
            <View
                style={styles.container}
            >
                <Header
                    renderPageHeader={(image, i) => {
                        return (
                            <View style={[styles.statusBarTop, styles.rowMiddleAlign]}>
                                <Image
                                    source={{
                                        uri: "https://luehangs.site/images/lue-hang2018-square.jpg"
                                    }}
                                    style={styles.userPic} />
                                <View>
                                <Text style={[
                                        styles.profilePrimary,
                                        styles.whiteText]}
                                    >
                                        www.luehangs.site
                                    </Text>
                                    <Text style={[
                                        styles.profileSecondary,
                                        styles.whiteText]}
                                    >
                                        React Native Development
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                />
                <SwipeRender
                    data={testData}
                    renderItem={({ item, index }) => {
                        return (
                            <View key={index} style={{flex: 1, backgroundColor: "#000"}}>
                                <Image
                                    source={findUri(item)}
                                    style={{flex: 1}}
                                    resizeMode="contain"
                                />
                                <Footer
                                    renderPageFooter={() => {
                                        return (
                                            <View style={[styles.footerBottom, styles.colMiddleAlign]}>
                                                <TouchableWithoutFeedback
                                                    onPress={() => {
                                                        Linking.openURL("https://www.luehangs.site");
                                                    }}
                                                >
                                                    <Text style={[styles.footerPrimary, { fontWeight: "bold", color: "#BABABA" }]}>
                                                        www.luehangs.site
                                                    </Text>
                                                </TouchableWithoutFeedback>
                                                <Text style={[
                                                    styles.footerSecondary,
                                                    { fontWeight: "bold", color: "#DFDFDF" }
                                                ]}>
                                                    Index {index} of {testData.length} pages.
                                                </Text>
                                            </View>
                                        );
                                    }}
                                />
                            </View>
                        );
                    }}
                    // index={0}
                    loop={true}
                    loadMinimal={true}
                    loadMinimalSize={2}
                />
                {/* <SwipeRender
                    // index={0}
                    loop={true}
                    loadMinimal={true}
                    loadMinimalSize={2}
                >
                    {
                        testData.map((data, index) => {
                            return (
                                <View key={index} style={{flex: 1, backgroundColor: "#000"}}>
                                    <Image
                                        source={findUri(data)}
                                        style={{flex: 1}}
                                        resizeMode="contain"
                                    />
                                </View>
                            );
                        })
                    }
                </SwipeRender> */}
            </View>
        );
    }
}

function isIPhoneX() {
    const X_WIDTH = 375;
    const X_HEIGHT = 812;
    return (
        Platform.OS === "ios" &&
            ((deviceHeight === X_HEIGHT && deviceWidth === X_WIDTH) ||
            (deviceHeight === X_WIDTH && deviceWidth === X_HEIGHT))
    );
}

function findUri (data) {
	return data.source
		? data.source : data.uri
		? { uri: data.uri } : data.URI
		? { uri: data.URI } : data.url
		? { uri: data.url } : data.URL
		? { uri: data.URL } : undefined;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#368FFA"
    },
    statusBarTop: {
        paddingTop: isIPhoneX()
            ? 30 + 2.5
            : platform === "ios"
            ? 20 + 2.5
            : 2.5
    },
    header: {
        height: isIPhoneX() ? 88 : 64,
        backgroundColor: "transparent"
    },
    mobileHeader: {
        width: deviceWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    rowMiddleAlign: {
        flexDirection: "row",
        alignItems: "center"
    },
    colMiddleAlign: {
        flexDirection: "column",
        justifyContent: "center"
    },
    footerBottom: {
        paddingBottom: isIPhoneX()
            ? 30 + 2.5
            : platform === "ios"
            ? 2.5
            : 2.5
    },
    userPic: {
        height: 30,
        width: 30,
        borderRadius: platform === "ios"
            ? 5 : 100,
        marginRight: 10,
        marginLeft: 10,
    },
    whiteText: {
        fontWeight: "bold",
        color: "#fafafa"
    },
    profilePrimary: {
        fontSize: 14,
        paddingHorizontal: 5
    },
    profileSecondary: {
        fontSize: 12,
        paddingHorizontal: 5
    },
    footerPrimary: {
        fontSize: 20,
        paddingHorizontal: 10
    },
    footerSecondary: {
        fontSize: 16,
        paddingHorizontal: 10
    }
});
