import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import FormStyles from './styles/Form';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      description
      price
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      name
      description
      price
    }
  }
`;

export default function UpdateProduct({ id }) {
  // 1. We need to get the existing product
  const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });

  // 2. We need to get the mutation to update the product
  const [
    updateProduct,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  const { inputs, handleChange, clearForm, resetForm } = useForm(data?.Product);

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await updateProduct({
      variables: {
        id,
        name: inputs.name,
        description: inputs.description,
        price: inputs.price,
      },
    }).catch(console.error);
    console.log(res);
  }
  if (loading) return <p>loading...</p>;
  return (
    <FormStyles onSubmit={handleSubmit}>
      <DisplayError error={error || updateError} />
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        <label htmlFor="name">
          Name
          <input
            required
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            value={inputs.name}
          />
        </label>

        <label htmlFor="price">
          Price
          <input
            value={inputs.price}
            type="number"
            id="price"
            name="price"
            placeholder="price"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            value={inputs.description}
            id="description"
            name="description"
            placeholder="Description"
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update product</button>
      </fieldset>
    </FormStyles>
  );
}
