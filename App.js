import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import FitnessWorld from './FitnessWorld'

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <FitnessWorld />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});