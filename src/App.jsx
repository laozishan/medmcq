import { useEffect } from 'react';
import './prototype.css';
import { prototypeHtml } from './prototypeMarkup.js';

const RUNTIME_SCRIPT_ID = 'medmcq-prototype-runtime';

export default function App() {
  useEffect(() => {
    const existing = document.getElementById(RUNTIME_SCRIPT_ID);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = RUNTIME_SCRIPT_ID;
    script.src = `${import.meta.env.BASE_URL}prototype-runtime.js`;
    script.async = false;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: prototypeHtml }} />;
}
