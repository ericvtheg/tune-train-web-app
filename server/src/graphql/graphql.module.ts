import { Module } from '@nestjs/common';
import { GraphQLModule as NestJsGraphQlModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { IdScalar } from 'src/graphql/scalars/id.scalar';

@Module({
  imports: [
    NestJsGraphQlModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: `${process.cwd()}/src/graphql/schema.gql`,
    }),
  ],
  providers: [IdScalar],
})
export class GraphQLModule {}