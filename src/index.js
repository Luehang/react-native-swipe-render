import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    Text,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Platform,
    StyleSheet,
    ActivityIndicator
} from "react-native";

export default class extends Component {
    static propTypes = {
        data: PropTypes.array,
        renderItem: PropTypes.func,
        children: PropTypes.node,
        horizontal: PropTypes.bool,
        loop: PropTypes.bool,
        index: PropTypes.number,
        autoplay: PropTypes.bool,
        autoplayTimeout: PropTypes.number,
        autoplayDirection: PropTypes.bool,
        onIndexChanged: PropTypes.func,
        onIndexChangeReached: PropTypes.func,
        enableAndroidViewPager: PropTypes.bool,
        loadMinimal: PropTypes.bool,
        loadMinimalSize: PropTypes.number,
        loadMinimalLoader: PropTypes.element,
        containerStyle: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
        ]),
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
        ]),
        scrollViewStyle: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
            PropTypes.array
        ]),
        refScrollView: PropTypes.func,
        showsButtons: PropTypes.bool,
        disableNextButton: PropTypes.bool,
        showsPagination: PropTypes.bool,
        paginationStyle: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number
        ]),
        renderPagination: PropTypes.func,
        dotStyle: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number
        ]),
        dotColor: PropTypes.string,
        activeDotStyle: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number
        ]),
        activeDotColor: PropTypes.string,
        pagingEnabled: PropTypes.bool,
        showsHorizontalScrollIndicator: PropTypes.bool,
        showsVerticalScrollIndicator: PropTypes.bool,
        bounces: PropTypes.bool,
        scrollsToTop: PropTypes.bool,
        automaticallyAdjustContentInsets: PropTypes.bool,
        removeClippedSubviews: PropTypes.bool,
    }

    static defaultProps = {
        horizontal: true,
        enableAndroidViewPager: false,
        showsPagination: false,
        showsButtons: false,
        disableNextButton: false,
        loop: false,
        loadMinimal: false,
        loadMinimalSize: 1,
        autoplay: false,
        autoplayTimeout: 2.5,
        autoplayDirection: true,
        index: 0,
        onIndexChanged: () => null,
        onIndexChangeReached: () => null,
        pagingEnabled: true,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
        bounces: false,
        scrollsToTop: false,
        automaticallyAdjustContentInsets: false,
        removeClippedSubviews: true,
    }

    state = this.initState(this.props);

    initialRender = true;

    autoplayTimer = null;
    loopJumpTimer = null;

    componentDidMount () {
        this.autoplay();
    }

    componentWillUnmount () {
        this.autoplayTimer && clearTimeout(this.autoplayTimer);
        this.loopJumpTimer && clearTimeout(this.loopJumpTimer);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.index !== nextState.index) {
            this.props.onIndexChanged(nextState.index);
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.index !== prevState.index) {
            this.props.onIndexChangeReached(this.state.index);
        }
        if (!this.props.autoplay && this.autoplayTimer) {
            clearTimeout(this.autoplayTimer);
        }
        if (this.props.index !== prevProps.index) {
            this.setState(this.initState(this.props, this.props.index !== prevProps.index));
        }
        // TO DO: Find better way to reset state when props received
        // if (!nextProps.autoplay && this.autoplayTimer) {
        //     clearTimeout(this.autoplayTimer);
        // }
        // this.setState(this.initState(nextProps, this.props.index !== nextProps.index));
    }

    initState (props, updateIndex = false) {
        // set the current state
        const state = this.state || { width: 0, height: 0, offset: { x: 0, y: 0 } };

        const initState = {
            autoplayEnd: false,
            loopJump: false,
            offset: {}
        };

        if (!props.children) {
            initState.total = props.data ? props.data.length || 1 : 0;
        } else {
            initState.total = props.children ? props.children.length || 1 : 0;
        }

        if (state.total === initState.total && !updateIndex) {
            // retain the index
            initState.index = state.index;
        } else {
            initState.index = initState.total > 1 ? Math.min(props.index, initState.total - 1) : 0;
        }

        // Default: horizontal
        const { width, height } = Dimensions.get("window");

        initState.dir = props.horizontal === false ? "y" : "x";

        if (props.width) {
            initState.width = props.width;
        } else if (this.state && this.state.width){
            initState.width = this.state.width;
        } else {
            initState.width = width;
        }

        if (props.height) {
            initState.height = props.height;
        } else if (this.state && this.state.height){
            initState.height = this.state.height;
        } else {
            initState.height = height;
        }

        initState.offset[initState.dir] = initState.dir === "y"
            ? height * props.index
            : width * props.index;


        this.internals = {
            ...this.internals,
            isScrolling: false
        };
        return initState;
    }

    // include internals with state
    fullState () {
        return Object.assign({}, this.state, this.internals);
    }

    onLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        const offset = this.internals.offset = {};
        const state = { width, height };

        if (this.state.total > 1) {
            let setup = this.state.index;
            if (this.props.loop) {
                setup++;
            }
            offset[this.state.dir] = this.state.dir === "y"
                ? height * setup
                : width * setup;
        }

        // only update the offset in state if needed, updating offset while swiping
        // causes some bad jumping / stuttering
        if (!this.state.offset || width !== this.state.width || height !== this.state.height) {
            state.offset = offset;
        }

        if (Platform.OS === "ios" || !this.props.enableAndroidViewPager) {
            if (this.initialRender && this.state.total > 1) {
                this.scrollView.scrollTo({...offset, animated: false});
                this.initialRender = false;
            }
        }

        this.setState(state);
    }

    loopJump = () => {
        if (!this.state.loopJump) {
            return;
        }
        const i = this.state.index + (this.props.loop ? 1 : 0);
        const scrollView = this.scrollView;
        this.loopJumpTimer = setTimeout(() => scrollView.setPageWithoutAnimation &&
            scrollView.setPageWithoutAnimation(i), 50);
    }

    autoplay = () => {
        if (!this.props.children) {
            if (!Array.isArray(this.props.data) ||
                !this.props.autoplay ||
                this.internals.isScrolling ||
                this.state.autoplayEnd) {
                    return;
            }
        } else {
            if (!Array.isArray(this.props.children) ||
                !this.props.autoplay ||
                this.internals.isScrolling ||
                this.state.autoplayEnd) {
                    return;
            }
        }

        this.autoplayTimer && clearTimeout(this.autoplayTimer);
        this.autoplayTimer = setTimeout(() => {
            if (!this.props.loop && (
                    this.props.autoplayDirection
                        ? this.state.index === this.state.total - 1
                        : this.state.index === 0
                )
            ) {
                return this.setState({ autoplayEnd: true });
            }

            this.scrollBy(this.props.autoplayDirection ? 1 : -1);
        }, this.props.autoplayTimeout * 1000);
    }

    onScrollBegin = e => {
        // update scroll state
        this.internals.isScrolling = true;
        this.props.onScrollBeginDrag && this.props.onScrollBeginDrag(e, this.fullState(), this);
    }

    onScrollEnd = e => {
        // update scroll state
        this.internals.isScrolling = false;

        // making our events coming from android compatible to updateIndex logic
        if (!e.nativeEvent.contentOffset) {
            if (this.state.dir === "x") {
                e.nativeEvent.contentOffset = {x: e.nativeEvent.position * this.state.width};
            } else {
                e.nativeEvent.contentOffset = {y: e.nativeEvent.position * this.state.height};
            }
        }

        this.updateIndex(e.nativeEvent.contentOffset, this.state.dir, () => {
            this.autoplay();
            this.loopJump();

            // if `onMomentumScrollEnd` registered will be called here
            this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(e, this.fullState(), this);
        });
    }

    onScrollEndDrag = e => {
        const { contentOffset } = e.nativeEvent;
        const { horizontal, data, children } = this.props;
        const { index } = this.state;
        const { offset } = this.internals;
        const previousOffset = horizontal ? offset.x : offset.y;
        const newOffset = horizontal ? contentOffset.x : contentOffset.y;

        if (!children) {
            if (previousOffset === newOffset &&
                (index === 0 || index === data.length - 1)) {
                this.internals.isScrolling = false;
            }
        } else {
            if (previousOffset === newOffset &&
                (index === 0 || index === children.length - 1)) {
                this.internals.isScrolling = false;
            }
        }
    }

    /**
     * Update index after scroll
     * @param  {object} offset content offset
     * @param  {string} dir    "x" || "y"
     */
    updateIndex = (offset, dir, cb) => {
        const state = this.state;
        let index = state.index;
        if (!this.internals.offset) {
            this.internals.offset = {};
        }

        const diff = offset[dir] - this.internals.offset[dir];
        const step = dir === "x" ? state.width : state.height;
        let loopJump = false;

        // Do nothing if offset no change.
        if (!diff) {
            return;
        }

        // Note: if touch very very quickly and continuous,
        // the variation of `index` more than 1.
        // parseInt() ensures it's always an integer
        // eslint-disable-next-line radix
        index = parseInt(index + Math.round(diff / step));

        if (this.props.loop) {
            if (index <= -1) {
                index = state.total - 1;
                offset[dir] = step * state.total;
                loopJump = true;
            } else if (index >= state.total) {
                index = 0;
                offset[dir] = step;
                loopJump = true;
            }
        }

        const newState = {};
        newState.index = index;
        newState.loopJump = loopJump;

        this.internals.offset = offset;

        // only update offset in state if loopJump is true
        if (loopJump) {
            // when swiping to the beginning of a looping set for the third time,
            // the new offset will be the same as the last one set in state.
            // Setting the offset to the same thing will not do anything,
            // so we increment it by 1 then immediately set it to what it should be,
            // after render.
            if (offset[dir] === this.internals.offset[dir]) {
                newState.offset = { x: 0, y: 0 };
                newState.offset[dir] = offset[dir] + 1;
                this.setState(newState, () => {
                    this.setState({ offset: offset }, cb);
                });
            } else {
                newState.offset = offset;
                this.setState(newState, cb);
            }
        } else {
            this.setState(newState, cb);
        }
    }

    /**
     * Scroll by index
     * @param  {number} index offset index
     * @param  {bool} animated
     */
    scrollBy = (index, animated = true) => {
        if (this.internals.isScrolling || this.state.total < 2) {
            return;
        }
        const state = this.state;
        const diff = (this.props.loop ? 1 : 0) + index + this.state.index;
        let x = 0;
        let y = 0;
        if (state.dir === "x") {
            x = diff * state.width;
        }
        if (state.dir === "y") {
            y = diff * state.height;
        }

        if (this.props.enableAndroidViewPager) {
            this.scrollView && this.scrollView[animated ? "setPage" : "setPageWithoutAnimation"](diff);
        } else {
            this.scrollView && this.scrollView.scrollTo({ x, y, animated });
        }

        // update scroll state
        this.internals.isScrolling = true;
        this.setState({
            autoplayEnd: false
        });

        // trigger onScrollEnd manually in android
        if (!animated || Platform.OS === "android") {
            setImmediate(() => {
                this.onScrollEnd({
                    nativeEvent: {
                        position: diff
                    }
                });
            });
        }
    }

    scrollViewPropOverrides = () => {
        const props = this.props;
        let overrides = {};

        for (let prop in props) {
            if (typeof props[prop] === "function" &&
                prop !== "onMomentumScrollEnd" &&
                prop !== "renderPagination" &&
                prop !== "onScrollBeginDrag"
            ) {
                let originResponder = props[prop];
                overrides[prop] = (e) => originResponder(e, this.fullState(), this);
            }
        }

        return overrides;
    }

    renderPagination = () => {
        // By default, dots only show when `total` >= 2
        if (this.state.total <= 1) {
            return null;
        }

        let dots = [];
        const ActiveDot = this.props.activeDot || <View style={[{
            backgroundColor: this.props.activeDotColor || "#007aff",
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3
        }, this.props.activeDotStyle]} />;
        const Dot = this.props.dot || <View style={[{
            backgroundColor: this.props.dotColor || "rgba(0,0,0,.2)",
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3
        }, this.props.dotStyle ]} />;
        for (let i = 0; i < this.state.total; i++) {
            dots.push(i === this.state.index
                ? React.cloneElement(ActiveDot, {key: i})
                : React.cloneElement(Dot, {key: i})
            );
        }

        return (
            <View pointerEvents="none" style={[styles["pagination_" + this.state.dir], this.props.paginationStyle]}>
                {dots}
            </View>
        );
    }

    renderNextButton = () => {
        let button = null;

        if (this.props.loop ||
            this.state.index !== this.state.total - 1) {
            button = this.props.nextButton || <Text style={styles.buttonText}>›</Text>;
        }

        return (
            <TouchableOpacity
                onPress={() => button !== null && this.scrollBy(1)}
                disabled={this.props.disableNextButton}
            >
                <View>
                    {button}
                </View>
            </TouchableOpacity>
        );
    }

    renderPrevButton = () => {
        let button = null;

        if (this.props.loop || this.state.index !== 0) {
          button = this.props.prevButton || <Text style={styles.buttonText}>‹</Text>;
        }

        return (
            <TouchableOpacity onPress={() => button !== null && this.scrollBy(-1)}>
                <View>
                    {button}
                </View>
            </TouchableOpacity>
        );
    }

    renderButtons = () => {
        return (
            <View pointerEvents="box-none" style={[styles.buttonWrapper, {
              width: this.state.width,
              height: this.state.height
            }, this.props.buttonWrapperStyle]}>
                {this.renderPrevButton()}
                {this.renderNextButton()}
            </View>
        );
    }

    refScrollView = view => {
        this.scrollView = view;
    }

    onPageScrollStateChanged = state => {
        switch (state) {
            case "dragging":
                return this.onScrollBegin();
            case "idle":
            case "settling":
                // eslint-disable-next-line curly
                if (this.props.onTouchEnd) this.props.onTouchEnd();
        }
    }

    renderScrollView = pages => {
        if (this.props.enableAndroidViewPager) {
            let ViewPagerAndroid;
            if (parseFloat(require("react-native/package.json").version) >= 0.6) {
                ViewPagerAndroid = require("@react-native-community/viewpager");
            } else {
                ViewPagerAndroid = require("react-native").ViewPagerAndroid;
            }
            return (
                <ViewPagerAndroid ref={(component) => {
                        this.refScrollView(component);
                        this.props.refScrollView &&
                            this.props.refScrollView(component);
                    }}
                    {...this.props}
                    initialPage={this.props.loop ? this.state.index + 1 : this.state.index}
                    onPageScrollStateChanged={this.onPageScrollStateChanged}
                    onPageSelected={this.onScrollEnd}
                    key={pages.length}
                    style={[styles.wrapperAndroid, this.props.style]}>
                    {pages}
                </ViewPagerAndroid>
            );
        }
        return (
            <ScrollView ref={(component) => {
                    this.refScrollView(component);
                    this.props.refScrollView &&
                        this.props.refScrollView(component);
                }}
                {...this.props}
                {...this.scrollViewPropOverrides()}
                contentContainerStyle={[styles.wrapperIOS, this.props.style]}
                contentOffset={this.state.offset}
                onScrollBeginDrag={this.onScrollBegin}
                onMomentumScrollEnd={this.onScrollEnd}
                onScrollEndDrag={this.onScrollEndDrag}
                style={this.props.scrollViewStyle}>
                {pages}
            </ScrollView>
        );
    }

    render () {
        const {
            index,
            total,
            width,
            height
        } = this.state;
        const {
            data,
            renderItem,
            children,
            containerStyle,
            loop,
            loadMinimal,
            loadMinimalSize,
            loadMinimalLoader,
            renderPagination,
            showsButtons,
            showsPagination,
        } = this.props;
        const loopVal = loop ? 1 : 0;
        let pages = [];

        const pageStyle = [{width: width, height: height}, styles.slide];
        const pageStyleLoading = {
            width,
            height,
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        };

        // For make infinite at least total > 1
        if (total > 1) {
            // Re-design a loop model for avoid img flickering
            if (!children) {
                pages = Object.keys(data);
            } else {
                pages = Object.keys(children);
            }
            if (loop) {
                pages.unshift(total - 1 + "");
                pages.push("0");
            }

            pages = pages.map((page, i) => {
                if (loadMinimal) {
                    if (i >= (index + loopVal - loadMinimalSize) &&
                        i <= (index + loopVal + loadMinimalSize)) {
                            if (!children) {
                                return <View style={pageStyle} key={i}>{renderItem({ item: data[page], index: i })}</View>;
                            } else {
                                return <View style={pageStyle} key={i}>{children[page]}</View>;
                            }
                    } else {
                        return (
                            <View style={pageStyleLoading} key={i}>
                                {loadMinimalLoader ? loadMinimalLoader : <ActivityIndicator />}
                            </View>
                        );
                    }
                } else {
                    if (!children) {
                        return <View style={pageStyle} key={i}>{renderItem({ item: data[page], index: i })}</View>;
                    } else {
                        return <View style={pageStyle} key={i}>{children[page]}</View>;
                    }
                }
            });
        } else {
            if (!children) {
                pages = <View style={pageStyle} key={0}>{renderItem({ item: data[0], index: 0 })}</View>;
            } else {
                pages = <View style={pageStyle} key={0}>{children}</View>;
            }
        }

        if (showsPagination || showsButtons) {
            return (
                <View style={[styles.container, containerStyle]} onLayout={this.onLayout}>
                    {this.renderScrollView(pages)}
                    {showsPagination && (renderPagination
                        ? renderPagination(index, total, this)
                        : this.renderPagination())}
                    {showsButtons && this.renderButtons()}
                </View>
            );
        }
        return (
            <View style={[styles.container, containerStyle]} onLayout={this.onLayout}>
              {this.renderScrollView(pages)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
        position: "relative",
        flex: 1
    },

    wrapperIOS: {
        backgroundColor: "transparent",
    },

    wrapperAndroid: {
        backgroundColor: "transparent",
        flex: 1
    },

    slide: {
        backgroundColor: "transparent",
    },

    /* eslint-disable react-native/no-unused-styles */
    pagination_x: {
        position: "absolute",
        bottom: 25,
        left: 0,
        right: 0,
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent"
    },

    pagination_y: {
        position: "absolute",
        right: 15,
        top: 0,
        bottom: 0,
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent"
    },
    /* eslint-enable */

    buttonWrapper: {
        backgroundColor: "transparent",
        flexDirection: "row",
        position: "absolute",
        top: 0,
        left: 0,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: "space-between",
        alignItems: "center"
    },

    buttonText: {
        fontSize: 50,
        color: "#007aff"
    }
});
