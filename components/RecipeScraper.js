// RecipeScraper.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { fetchRecipe } from '../config/scraperService';

export default function RecipeScraper() {




    console.log("RecipeScraper gerendert");
    //...
    const handleScrape = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchRecipe(url);
            setRecipe(data);
        } catch (err) {
            setError(err.message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    //...
}