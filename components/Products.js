import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import styled from "styled-components";
import { perPage } from "../config";
import Product from "./Product";

export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY($skip: Int = 0, $take: Int) {
    products(skip: $skip, take: $take) {
      id
      name
      price
      description
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const ProductsListStyle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

export default function Products({ page }) {
  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY, {
    variables: {
      skip: page * perPage - perPage,
      take: perPage,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <ProductsListStyle>
        {(data.products.length !== 0 &&
          data.products.map((product) => (
            <Product key={product.id} product={product} />
          ))) || <p>No products</p>}
      </ProductsListStyle>
    </div>
  );
}
