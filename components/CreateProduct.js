import { useMutation } from '@apollo/client';
import Router from 'next/router';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import FormStyles from './styles/Form';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {
  const { inputs, handleChange, clearForm, resetForm } = useForm();

  // use variables at the time of definition, if we know what the variables will be
  // at this time
  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: inputs,
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }], // to reload products on products page
    }
  );

  /*  const [createProduct, { loading, eror, data }] = useMutation(
    CREATE_PRODUCT_MUTATION
  ); */

  async function handleSubmit(e) {
    e.preventDefault();

    /* const res = createProduct({
      variables: inputs,
    }); */
    // submit the input fields to backend
    const res = await createProduct();
    clearForm();
    // go to the products page
    Router.push({
      pathname: `/product/${res.data.createProduct.id}`,
    });
  }
  return (
    <FormStyles onSubmit={handleSubmit}>
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="name">
          Name
          <input
            required
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="image">
          Image
          <input
            required
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
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
        <button type="submit">+ Add product</button>
      </fieldset>
    </FormStyles>
  );
}
