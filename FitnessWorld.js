import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Video } from 'expo-av';

export default function DualTimerApp() {
    const [screenKey, setScreenKey] = useState(0);
    return <DualTimerScreen key={screenKey} onReset={() => setScreenKey(prev => prev + 1)} />;
}

function DualTimerScreen({ onReset }) {
    const [leftMinutes, setLeftMinutes] = useState(0);
    const [leftSeconds, setLeftSeconds] = useState(0);
    const [rightMinutes, setRightMinutes] = useState(0);
    const [rightSeconds, setRightSeconds] = useState(0);
    const [leftDelay, setLeftDelay] = useState(0);
    const [rightDelay, setRightDelay] = useState(0);
    const [leftRunning, setLeftRunning] = useState(false);
    const [rightRunning, setRightRunning] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);
    const [videoFinished, setVideoFinished] = useState(false);

    const startTimers = () => {
        if (leftMinutes === 0 && leftSeconds === 0 && rightMinutes === 0 && rightSeconds === 0) {
            Alert.alert("Warning", "Insert time first", [{ text: "OK" }]);
            return;
        }
        setVideoPlaying(true);
        setVideoFinished(false);
    };

    const handleVideoFinish = () => {
        setVideoPlaying(false);
        setVideoFinished(true);

        if (leftMinutes > 0 || leftSeconds > 0) {
            setLeftRunning(true);
        }

        if (rightMinutes > 0 || rightSeconds > 0) {
            setRightRunning(true);
        }
    };

    useEffect(() => {
        let leftInterval;
        if (leftRunning && (leftMinutes > 0 || leftSeconds > 0)) {
            leftInterval = setInterval(() => {
                setLeftSeconds(prev => {
                    if (prev === 0) {
                        if (leftMinutes === 0) {
                            setLeftRunning(false);
                            return 0;
                        }
                        setLeftMinutes(m => m - 1);
                        return 59;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(leftInterval);
    }, [leftRunning, leftMinutes, leftSeconds]);

    useEffect(() => {
        let rightInterval;
        if (rightRunning && (rightMinutes > 0 || rightSeconds > 0)) {
            rightInterval = setInterval(() => {
                setRightSeconds(prev => {
                    if (prev === 0) {
                        if (rightMinutes === 0) {
                            setRightRunning(false);
                            return 0;
                        }
                        setRightMinutes(m => m - 1);
                        return 59;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(rightInterval);
    }, [rightRunning, rightMinutes, rightSeconds]);

    return (
        <View style={styles.container}>
            <View style={styles.sideContainer}>
                <Text style={styles.label}>Left Side</Text>
                <Text style={styles.timer}>{`${leftMinutes}:${leftSeconds < 10 ? '0' : ''}${leftSeconds}`}</Text>
                <TextInput style={styles.input} placeholder="Minutes" keyboardType="numeric" onChangeText={text => setLeftMinutes(Number(text) || 0)} />
                <TextInput style={styles.input} placeholder="Seconds" keyboardType="numeric" onChangeText={text => setLeftSeconds(Number(text) || 0)} />
                <TextInput style={styles.input} placeholder="Delay (sec)" keyboardType="numeric" onChangeText={text => setLeftDelay(Number(text) || 0)} />
            </View>
            <View style={styles.controlContainer}>
                <TouchableOpacity onPress={startTimers} style={styles.startButton}><Text style={styles.buttonText}>Start</Text></TouchableOpacity>
                <TouchableOpacity onPress={onReset} style={styles.resetButton}><Text style={styles.buttonText}>Reset</Text></TouchableOpacity>
                {videoPlaying && (
                    <View style={styles.videoContainer}>
                        <Video
                            source={require('./assets/video.mp4')}
                            style={styles.video}
                            shouldPlay
                            resizeMode="contain"
                            onPlaybackStatusUpdate={status => {
                                if (status.didJustFinish) handleVideoFinish();
                            }}
                        />
                    </View>
                )}
            </View>
            <View style={styles.sideContainer}>
                <Text style={styles.label}>Right Side</Text>
                <Text style={styles.timer}>{`${rightMinutes}:${rightSeconds < 10 ? '0' : ''}${rightSeconds}`}</Text>
                <TextInput style={styles.input} placeholder="Minutes" keyboardType="numeric" onChangeText={text => setRightMinutes(Number(text) || 0)} />
                <TextInput style={styles.input} placeholder="Seconds" keyboardType="numeric" onChangeText={text => setRightSeconds(Number(text) || 0)} />
                <TextInput style={styles.input} placeholder="Delay (sec)" keyboardType="numeric" onChangeText={text => setRightDelay(Number(text) || 0)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', backgroundColor: 'black', padding: 20 },
    sideContainer: { flex: 1, alignItems: 'center' },
    controlContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 20 },
    label: { fontSize: 24, color: 'white' },
    timer: { fontSize: 50, color: '#ff7f00', fontWeight: 'bold' },
    input: { width: 100, height: 40, borderBottomWidth: 1, borderBottomColor: '#ff7f00', color: 'white', textAlign: 'center', marginTop: 10 },
    videoContainer: { marginTop: 20, alignItems: 'center', width: 300, height: 300 },
    video: { width: '100%', height: '100%' },
    startButton: { backgroundColor: 'green', padding: 15, margin: 10, borderRadius: 10, alignItems: 'center', width: 150 },
    resetButton: { backgroundColor: 'red', padding: 15, margin: 10, borderRadius: 10, alignItems: 'center', width: 150 },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});