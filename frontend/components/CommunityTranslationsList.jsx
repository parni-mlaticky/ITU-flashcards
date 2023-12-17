/**
 * @file List of community translations for an article, shown on the article details page.
 * @author Vladimír Hucovič
 */

import { useEffect, useState, useCallback} from 'react';
import { Text } from 'react-native';
import axios from 'axios';
import { Center, HStack, VStack } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const CommunityTranslationsList = ({ article, show, translationSelectCallback }) => {
    const [translations, setTranslations] = useState([]);
    const [selectedTranslation, setSelectedTranslation] = useState(null);

    
    const getTranslations = async () => {
        console.log("getting translations");
        console.log("article id", article.id)
        const translations = await axios.get(`/articles/${article.id}/translation`);
        console.log("aaa", translations.data);
        setTranslations(translations.data);
    }

    const selectTranslation = (index) => {
        if(selectedTranslation === index) {
            setSelectedTranslation(null);
            translationSelectCallback(null);
            return;
        }
        console.log("selecting translation", index);
        setSelectedTranslation(index);
        translationSelectCallback(translations[index]);
    }

    useEffect(() => {
        getTranslations();
    }, [article]);

    useFocusEffect(
        useCallback(() => {
          getTranslations();
        }, [])
      );

    return (
        <>
        {show ? 
        <VStack>
            {translations ? 
                translations.map((translation, index) => {
                    const isSelected = selectedTranslation === index;
                    return (
                        <TouchableHighlight style={isSelected ? {backgroundColor: "lightblue"} : null} key={index} underlayColor="lightblue" onPress={() => {selectTranslation(index)}}>
                            <HStack safeArea={5} alignItems="center" justifyContent="space-between" width="75%">
                                <Text flex={1} textAlign="left" paddingLeft={1}>{"Author: " + translation.username}</Text>
                                <HStack flex={1} justifyContent="flex-end">
                                    <Icon name="star" size={20} color="gold" />
                                    <Text marginLeft={1}></Text>
                                </HStack>
                            </HStack>
                        </TouchableHighlight>
                    );
                })
            : <Text>No translations yet</Text>}
        </VStack> 
        : null}
        </>
    );
}

export default CommunityTranslationsList;