import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistroFormComponent } from './registro-form/registro-form.component';
import { ContatoItemComponent } from './contatos/contato-list/contato-item/contato-item.component';
import { ContatoListComponent } from './contatos/contato-list/contato-list.component';
import { ContatoSearchComponent } from './contatos/contato-search/contato-search.component';
// import { ContatosComponent } from './contatos/contatos.component';
// import { HeaderComponent } from './header/header.component';
import { FeedEditComponent } from './feeds/feed-edit/feed-edit.component';
import { FeedItemComponent } from './feeds/feed-list/feed-item/feed-item.component';
import { FeedListComponent } from './feeds/feed-list/feed-list.component';
import { PerfilEditComponent } from './perfil-edit/perfil-edit.component';
// import { FeedsComponent } from './feeds/feeds.component';

@NgModule({
    declarations: [
        LoginFormComponent,
        RegistroFormComponent,
        ContatoItemComponent,
        ContatoListComponent,
        ContatoSearchComponent,
        // ContatosComponent,
        // HeaderComponent,
        FeedEditComponent,
        FeedItemComponent,
        FeedListComponent,
        // FeedsComponent
        PerfilEditComponent
    ],
    imports: [IonicModule],
    exports: [
        LoginFormComponent,
        RegistroFormComponent,
        ContatoItemComponent,
        ContatoListComponent,
        ContatoSearchComponent,
        // ContatosComponent,
        // HeaderComponent,
        FeedEditComponent,
        FeedItemComponent,
        FeedListComponent,
        // FeedsComponent
        PerfilEditComponent
    ]
})

export class ComponentsModule {

}