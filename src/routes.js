import React from "react";

const {Router, Route, IndexRoute, Redirect, browserHistory} = require("react-router");
const root = (
    <Router history={browserHistory}>
        <Route path="/" getComponent={(nextState, cb) => {
            require.ensure([], require => {
                cb(null, require("./main/body/index/Index.js"));
            }, "Index");
        }}
        >
        </Route>
        <Route
            path="/Echarts-gl"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/echarts-gl/Echarts.js"));
                    }, "Echarts-gl");
                }
            }>
        </Route>
        <Route
            path="/Hexagon"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/hexagon/Hexagon.js"));
                    }, "Hexagon");
                }
            }>
        </Route>
        <Route
            path="/Hexagon02"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/hexagon/Hexagon02.js"));
                    }, "Hexagon02");
                }
            }>
        </Route>
        <Route
            path="/Echarts-pie"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/echarts/echarts-pie/Pie.js"));
                    }, "Echarts-pie");
                }
            }>
        </Route>
        <Route
            path="/Rank"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/rank/Rank.js"));
                    }, "Rank");
                }
            }>
        </Route>
        <Route
            path="/ThreeJS"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/threejs/index.js"));
                    }, "ThreeJS");
                }
            }>
        </Route>
        <Route
            path="/demo01"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/threejs/demo01.js"));
                    }, "demo01");
                }
            }>
        </Route>
        <Route
            path="/demo02"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/threejs/demo02.js"));
                    }, "demo02");
                }
            }>
        </Route>
        <Route
            path="/demo03"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/threejs/demo03.js"));
                    }, "demo03");
                }
            }>
        </Route>
        <Route
            path="/Echarts-line"
            getComponent={
                (nextState, cb) => {
                    require.ensure([], require => {
                        cb(null, require("./main/body/echarts/echarts-line/LIne.js"));
                    }, "Echarts-line");
                }
            }>
        </Route>
    </Router>
);
module.exports = root;