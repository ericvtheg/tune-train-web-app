import { Scalar, CustomScalar, ID } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('ID', (type) => ID)
export class IdScalar implements CustomScalar<string, number> {
  description = 'Date custom scalar type';

  parseValue(value: string): number {
    return parseInt(Buffer.from(value, 'base64').toString(), 10); // value from the client
  }

  serialize(value: number): string {
    return Buffer.from(value.toString()).toString('base64'); // value sent to the client
  }

  parseLiteral(ast: ValueNode): number {
    if (ast.kind === Kind.STRING) {
      return parseInt(Buffer.from(ast.value, 'base64').toString(), 10);
    }
    throw new Error('failed to parse number');
  }
}
