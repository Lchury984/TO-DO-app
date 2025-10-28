import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
} from 'react-native';
import { useTodosControllers } from '@/controllers/useTodosControllers';
import { Todo } from '@/models/Todo';

export default function TodosScreen() {
    const { todos, addTodo, toggleTodo, deleteTodo } = useTodosControllers();
    const [inputText, setInputText] = useState('');

    const renderTodo = ({ item }: { item: Todo }) => (
        <View style={styles.todoItem}>
            <TouchableOpacity
                style={styles.todoContent}
                onPress={() => toggleTodo(item.id)}
            >
                <View
                    style={[
                        styles.checkbox,
                        item.completed && styles.checkboxChecked]}
                >
                    {item.completed && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                <Text
                    style={[
                        styles.todoText,
                        item.completed && styles.todoTextCompleted,]}
                >
                    {item.title}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => deleteTodo(item.id)}
            style={styles.deleteButton}
        >
            <Text style={styles.deleteButtonText}>✖️</Text>
        </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Tareas 📒</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Agregar nueva tarea..."
                    placeholderTextColor="#8f8c8cff"
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={async() => {
                        await addTodo(inputText);
                        setInputText("");
                    }}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={todos}
                renderItem={renderTodo}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                />

                <Text style={styles.footer}>
                    Tareas: {todos.length} | Completadas: {" "}
                    {todos.filter((t) => t.completed).length}
                </Text>
        </View>
    );
}
                    
        

const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: '#afd9dbff',

        padding: 20,

    },

    title: {

        fontSize: 32,

        fontWeight: 'bold',

        marginBottom: 20,

        marginTop: 40,

    },

    inputContainer: {

        flexDirection: 'row',

        marginBottom: 20,

    },

    input: {

        flex: 1,

        backgroundColor: 'white',

        padding: 15,

        borderRadius: 10,

        fontSize: 16,

        marginRight: 10,

    },

    addButton: {

        backgroundColor: '#237573ff',

        width: 50,

        height: 50,

        borderRadius: 25,

        justifyContent: 'center',

        alignItems: 'center',

    },

    addButtonText: {

        color: 'white',

        fontSize: 30,

        fontWeight: 'bold',

    },

    list: {

        flex: 1,

    },

    listContent: {

        paddingBottom: 20,

    },

    todoItem: {

        flexDirection: 'row',

        backgroundColor: 'white',

        padding: 15,

        borderRadius: 10,

        marginBottom: 10,

        alignItems: 'center',

    },

    todoContent: {

        flex: 1,

        flexDirection: 'row',

        alignItems: 'center',

    },

    checkbox: {

        width: 24,

        height: 24,

        borderRadius: 12,

        borderWidth: 2,

        borderColor: '#237573ff',

        marginRight: 12,

        justifyContent: 'center',

        alignItems: 'center',

    },

    checkboxChecked: {

        backgroundColor: '#237573ff',

    },

    checkmark: {

        color: 'white',

        fontSize: 16,

        fontWeight: 'bold',

    },

    todoText: {

        fontSize: 16,

        flex: 1,

    },

    todoTextCompleted: {

        textDecorationLine: 'line-through',

        color: '#b70404ff',

    },

    deleteButton: {

        padding: 8,

    },

    deleteButtonText: {

        fontSize: 25,

    },

    footer: {

        textAlign: 'center',

        color: '#464646ff',

        marginTop: 10,

        fontSize: 14,

    },

});
