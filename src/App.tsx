import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import TodoList from './Component/TodoList';
import 'bootstrap/dist/css/bootstrap.css';
// import store from './redux/store';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
import tasksReducer from './redux/reducers';
import { createStore } from 'redux';
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, tasksReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);



function App() {
  return (
    <div className='App'>
      
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <TodoList />
    </PersistGate>
    </Provider>
    </div>
  );
}

export default App;
