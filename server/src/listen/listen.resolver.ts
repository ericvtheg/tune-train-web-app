import { Query, Resolver, Args } from '@nestjs/graphql';
import { Listen } from 'src/listen/listen.model';

@Resolver(of => Listen)
export class ListenResolver {}