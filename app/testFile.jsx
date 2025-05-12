//create text page here 


import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
BASE_URL = "http://192.168.2.40:3000/api/messages";

const TestingFile = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                   // Fetch the token from AsyncStorage
        console.log('Fetching token...from MessagesTab');
        const token = await AsyncStorage.getItem('authToken');
        console.log('Token:', token); // Log the token to check if it's being retrieved correctly
      if (!token) {
        console.error('No token found');
        return;
      }
                const result = await axios.get(`${BASE_URL}/test`, {
                    
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Data fetched:", result.data); // Log the response data
                setData(result.data); // Update state with the response data
            } catch (error) {
                console.error("Error fetching data:", error); // Handle errors
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <View>
            <Text>Test</Text>
            {data && <Text>{JSON.stringify(data)}</Text>} {/* Display fetched data */}
        </View>
    );
};
export default TestingFile;