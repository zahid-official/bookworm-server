/* eslint-disable @typescript-eslint/no-dynamic-delete */

import { Query } from "mongoose";
import { excludeFields } from "./constants";

class QueryBuilder<T> {
  // Class properties
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    // Assign the parameters to class properties
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Method to filter the query results
  filter(): this {
    const filter = { ...this.query };
    excludeFields?.forEach((field) => delete filter[field]);
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  // Method to select specific fields in the query (projection)
  fieldSelect(): this {
    const fields = this.query?.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // Method to sort the query results
  sort(): this {
    const sortBy = this.query?.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  // Method to implement search functionality
  search(searchFields: string[]): this {
    const searchTerm = this.query?.searchTerm || "";
    const searchQuery = {
      $or: searchFields?.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };

    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }

  // Method to implement pagination
  paginate(): this {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 9;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // Method to execute the built query
  build(): Query<T[], T> {
    return this.modelQuery;
  }

  // Method to get meta data
  async meta(): Promise<{
    page: number;
    limit: number;
    totalPage: number;
    totalDocs: number;
  }> {
    const queryConditions = this.modelQuery.getQuery();
    const totalDocs = await this.modelQuery.model.countDocuments(
      queryConditions
    );
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 9;
    const totalPage = Math.ceil(totalDocs / limit);

    return { page, limit, totalPage, totalDocs };
  }
}

export default QueryBuilder;
