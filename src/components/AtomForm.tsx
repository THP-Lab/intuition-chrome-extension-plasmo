import React, { useState } from 'react';
import { usePinThingMutation } from '@0xintuition/graphql';

const CreateAtomForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');

  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: pinThing } = usePinThingMutation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setProgressMessage('Pinning Atom metadata...');
    setErrorMessage(null);

    try {
      const result = await pinThing({
        name,
        description,
        image,
        url,
      });

      if (!result.pinThing?.uri) {
        throw new Error('Failed to pin atom metadata.');
      }
      setProgressMessage(`Atom pinned! URI: ${result.pinThing.uri}`);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-200 rounded">
      <div>
        <label htmlFor="name" className="font-bold mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block font-bold mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="image" className="block font-bold mb-1">
          Image URL
        </label>
        <input
          id="image"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="url" className="block font-bold mb-1">
          URL
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {isSubmitting ? 'Submitting...' : 'Create Atom'}
      </button>
      {progressMessage && <p className="text-sm text-green-600">{progressMessage}</p>}
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </form>
  );
};

export default CreateAtomForm;
