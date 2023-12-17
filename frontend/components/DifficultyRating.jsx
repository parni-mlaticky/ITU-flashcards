import axios from "axios";
import {Text, Box, Center, Button, HStack} from "native-base"
import { useEffect } from "react";
import {Image, Linking, TextInput} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

const difficutlyRating = (article) => {
    const [rating, setRating] = useState(null);
    const [ratingChangeInProgress, setRatingChangeInProgress] = useState(false);

    const sendNewRating = async (rating) => {
        setRatingChangeInProgress(true);
        const userId = await AsyncStorage.getItem("user");
        const sendRating = async (rating) => {
            await axios.post(`/articles/${article.article.id}/rating`, {rating: rating, userId: userId});
            console.log("rated in backedn: ", rating);
        }
        sendRating(rating);
        setRating(rating);
        console.log("Rated: ", rating);
        setRatingChangeInProgress(false);
    }

    const unsetRating = async () => {
        setRatingChangeInProgress(true);
        const userId = await AsyncStorage.getItem("user");
        console.log("userId", userId)
        const unsetRating = async () => {
            await axios.delete(`/articles/${article.article.id}/rating`, {data:{userId: userId}});
        }
        unsetRating();
        setRating(null);
        console.log("Unrated");
        setRatingChangeInProgress(false);
    }

    useEffect(() => {
        const fetchRating = async () => {
            const userId = await AsyncStorage.getItem("user");
            const query = `/articles/${article.article.id}/rating/${userId}`
            const userRating = await axios.get(query);
            setRating(userRating?.data?.rating || null);
        }
        fetchRating();
    }, [rating]);

    return (
        <>
        <Box safeAreaBottom={2} alignItems={"center"}>
            <Text fontSize={30}>Difficulty rating</Text>
            <HStack>
                <Text style={{verticalAlign:"middle"}} marginTop={4} marginLeft={5} marginRight={5}>Easy</Text>
                    <Button style={ rating === 1 ? {backgroundColor:"red"} : null} margin={1} key="rate1" onPress={() => {if(!ratingChangeInProgress) rating !== 1 ? sendNewRating(1) : unsetRating()}}>1</Button>
                    <Button style={ rating === 2 ? {backgroundColor:"red"} : null} margin={1} key="rate2" onPress={() => {if(!ratingChangeInProgress) rating !== 2 ? sendNewRating(2) : unsetRating()}}>2</Button>
                    <Button style={ rating === 3 ? {backgroundColor:"red"} : null} margin={1} key="rate3" onPress={() => {if(!ratingChangeInProgress) rating !== 3 ? sendNewRating(3) : unsetRating()}}>3</Button>
                    <Button style={ rating === 4 ? {backgroundColor:"red"} : null} margin={1} key="rate4" onPress={() => {if(!ratingChangeInProgress) rating !== 4 ? sendNewRating(4) : unsetRating()}}>4</Button>
                    <Button style={ rating === 5 ? {backgroundColor:"red"} : null} margin={1} key="rate5" onPress={() => {if(!ratingChangeInProgress) rating !== 5 ? sendNewRating(5) : unsetRating()}}>5</Button>
                <Text style={{verticalAlign:"middle"}} marginTop={4} marginLeft={5} marginRight={5}>Difficult</Text>
            </HStack>
        </Box>
        </>
    );
}

export default difficutlyRating;