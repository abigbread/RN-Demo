import React, { Component } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
// import { from } from 'rxjs';

//屏幕信息
const dimensions = require('Dimensions');
//获取屏幕的宽度和高度
const { width, height } = dimensions.get('window');
/**
 * @author abigbread2018 
 */
export default class FlatListPage extends Component {
    constructor(props) {
        super(props)
        this.page = 0;
        this.state = {
            data: [],
            isRefresh: false,
            isCloseLoadMore: false,//当数据加载完后，设为true，不在加载更多
            isLoadingMore:false //是否在加载更多
        }   

    }

    componentDidMount() {
        this._getData();
    }

    _refresh() {
        console.log("_refresh--data.length=" + this.state.data.length + "--page=" + this.page);
        if (!this.state.isRefresh) {
            this.page = 0;
            this._getData();
        }
    }

    _loadMore() {
        console.log("_loadMore--data.length=" + this.state.data.length + "--page=" + this.page);
        if (!this.state.isCloseLoadMore && !this.state.isLoadingMore && this.state.data.length > 0) {
            this.page += 1;
            this._getData();
            this.setState({
                isLoadingMore:true //未加载完成时，不再触发接口
            })
        }
    }

    _getData() {
        console.log("_getData--page=" + this.page);
        //玩Android  首页文章列表接口，服务器资源紧张，时不时的会请求失败，不要急躁
        fetch("https://www.wanandroid.com/article/list/" + this.page + "/json")
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log("success--" + JSON.stringify(responseJson));
                if (this.page == 0) {
                    console.log("从头加载！isCloseLoadMore=" + this.state.isCloseLoadMore + "--isRefresh=" + this.state.isRefresh);
                    this.setState({
                        isCloseLoadMore: false,
                        isLoadingMore:false,//加载完成时，可以继续加载
                        data: responseJson.data.datas
                    })
                } else {
                    console.log("加载更多！isCloseLoadMore=" + this.state.isCloseLoadMore + "--isRefresh=" + this.state.isRefresh);
                    this.setState({
                        isCloseLoadMore: false,
                        isLoadingMore:false,//加载完成时，可以继续加载
                        data: this.state.data.concat(responseJson.data.datas)//将新数据拼接到前数据，合并
                    })
                }

            })
            .catch((error) => {
                console.error("error--" + error);
                this.setState({
                    isRefresh:false,
                    isCloseLoadMore:false,
                    isLoadingMore:false,//加载失败时，可以继续加载
                })
            });
    }

    _item(item) {
        console.log("_item--id=" + item.id)
        return (
            <View style={styles.itemContainer} key={item.id}>
                <Text style={styles.text}> {item.title}</Text>
                <View style={styles.itemLine}></View>
            </View>
        )
    }
    _emptyView() {
        return (
            <View style={styles.emptyViewContainer}>
                <Text style={styles.text}> 么得数据！</Text >
            </View>
        )
    }

    _headerView() {
        return (
            <View style={[styles.headerContainer, styles.itemBackground]}>
                <Text style={styles.text}>this  is  header  view</Text>
            </View>
        )
    }

    _footerView() {
        return (
            <View style={[styles.footerContainer, styles.itemBackground]}>
                <Text style={styles.text}>正在加载呢，你别拽了啊!</Text>
            </View>
        )
    }

    render() {
        return (
            <FlatList style={styles.flatListContainer}
                data={this.state.data}
                //item布局
                renderItem={({ item }) => this._item(item)}
                //下拉刷新
                onRefresh={() => this._refresh()}
                refreshing={this.state.isRefresh}
                //加载更多
                onEndReached={() => this._loadMore()}
                onEndReachedThreshold={0.1}
                //没数据时候的布局
                ListEmptyComponent={this._emptyView}
                //头布局
                ListHeaderComponent={this._headerView}
                //尾布局
                ListFooterComponent={this._footerView}
            />
        )
    }

}


var styles = StyleSheet.create({
    flatListContainer: {
        flex: 1,
    },
    emptyViewContainer: {
        flexDirection: "row",
        height: height - 50,//避免华为手机屏幕底部的虚拟键占得高度
        alignItems: "stretch",
    },
    text: {
        flex: 1,
        textAlignVertical: "center",//这个才可把文字垂直居中 textAlign 不能垂直居中
        textAlign: "center",
    },
    headerContainer: {
        flex: 1,
        flexDirection: "column",
        height: height / 20
    },
    footerContainer: {
        flex: 1,
        flexDirection: "column",
        height: height / 15
    },
    itemContainer: {
        flex: 1,
        flexDirection: "column",
        height: height / 10
    },
    itemLine: {
        backgroundColor: "#cccccc",
        height: 2
    },
    itemBackground: {
        backgroundColor: "#555555"
    }

});