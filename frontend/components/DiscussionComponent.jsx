/**
 * @file Discussion component, shown on the article details page. Allows users to post comments and view comments from other users.
 * @author Vladimír Hucovič
 */

import { Box, Text, KeyboardAvoidingView, ScrollView, Button } from 'native-base'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { TextInput, View, Keyboard } from 'react-native'
import { StyleSheet } from 'react-native'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const DiscussionComponent = ({article}) => {
    const scrollViewRef = useRef(null)
    const { id } = article

    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")

    const fetchComments = async () => {
        commentData = []
        const response = await axios.get(`/articles/${id}/comments`);
        for(let comment of response.data){
            const authorName = await axios.get(`/users/name/${comment.author_id}`)
            const date = new Date(comment.timestamp);
            const dateString = date.toLocaleDateString();
            const timeString = date.toLocaleTimeString();
            commentData.push({author: authorName.data.username, content: comment.content, time: timeString, date: dateString})
        }
        setComments(commentData);
    }

    const postComment = async () => {
        const userId = await AsyncStorage.getItem("user");

        const response = await axios.post(`/articles/${id}/comments`, {
            userId: userId,
            comment: newComment
          });

        setNewComment("");

        fetchComments();
    }


    useEffect(() => {
        fetchComments();
    }, [])



    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <Box marginBottom={10} marginLeft={5} marginRight={5}>
                <ScrollView ref={scrollViewRef} style={{flex:1}}>
                    <Box style={{margin:10, alignContent:"center"}}>
                        <Text marginBottom={0} alignSelf={"center"} fontSize={30}>Discussion</Text>
                    </Box>
                    {comments.length === 0 ? <Text margin={3} alignSelf={"center"}>No one has commented so far.</Text> : comments.map((comment, index) => {
                        return (
                            <Box key={index} style={{margin:10, alignContent:"center"}}>
                                <Text style={{width:"100%", borderColor:"black", borderRadius:2, borderWidth:1}} marginBottom={0} alignSelf={"center"} fontSize={15}>Author: {comment.author}</Text>
                                <Text style={{width:"100%", borderColor:"black", borderRadius:2, borderWidth:1}} marginBottom={0} alignSelf={"center"} fontSize={15}>{comment.date} at {comment.time}</Text>
                                <Text style={{width:"100%", minHeight:50, borderColor:"black", borderRadius:2, borderWidth:1}}marginBottom={0} alignSelf={"center"} fontSize={15}>{comment.content}</Text>
                            </Box>
                        )
                    })}
                    <Text alignSelf="center" fontSize={30}>Post a comment</Text>
                    <TextInput value={newComment} onChangeText={(newText) => {setNewComment(newText)}} placeholder='Write a comment!' placeholderTextColor="grey" style={styles.textInput}/>
            {newComment !== "" && <Button marginTop={5} marginBottom={10} onPress={() => {postComment()}}>Post a comment</Button>}
                </ScrollView>
        </Box>
        </KeyboardAvoidingView>

    )
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
        margin:10
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginBottom: 20
    },
    text: {
        margin: 20,
        textAlign: 'left',
    },
    inputContainer: {
        width: '80%'
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        minHeight: 90,
        fontSize: 16
    }
});


export default DiscussionComponent;