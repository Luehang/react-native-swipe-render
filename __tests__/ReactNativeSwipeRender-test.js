import "react-native";
import React from "react";
import { View } from "react-native";
import SwipeRender from "../src";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

it("React Native Pages Render renders correctly", () => {
    renderer.create(<SwipeRender><View/></SwipeRender>);
});
