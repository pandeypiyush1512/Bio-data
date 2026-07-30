import React from 'react';
import { FormProvider } from './context/FormContext';
import Layout from './components/Layout';

export default function App() {
  return (
    <FormProvider>
      <Layout />
    </FormProvider>
  );
}
