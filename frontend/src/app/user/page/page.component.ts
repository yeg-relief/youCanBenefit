import { Component, OnInit, Input} from '@angular/core';
import { PageService } from './page.service';
import { AuthService } from 'src/app/admin/core/services/auth.service';
import { Page } from '../../shared/models';
import { MatSnackBar } from '@angular/material';
import { QuillService } from '../../admin/quill/quill.service';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css', '../../admin/quill/quill.css']
})
export class PageComponent implements OnInit {
  @Input() pageTitle: string;
  page: Page;
  quillModules = {};
  showEditButton = false;
  editMode = false;
  
  editingDocument: string;

  constructor(
    private pageService: PageService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private quillService: QuillService
  ) {}

  ngOnInit() {
    this.page = {
      title: this.pageTitle,
      documents: [],
      created: -1
    }

    this.quillModules = this.quillService.getQuillModules();

    this.showEditButton = this.authService.isLoggedIn;

    this.pageService.getPage(this.pageTitle)
    .then((page: Page) => this.page.documents = page.documents )
    .catch(() => {
      this.snackBar.open('error: unable to retrieve page.', '', { duration: 2000 });
    });
  }

  editorCreated(editor) {
    this.quillService.setQuillEditor(editor);
  }

  editDocument(guid) {
    if (this.editingDocument == guid) {
      this.editingDocument = "";
    } else {
      this.editingDocument = guid;
    }
  }

  addDocument() {
    this.page.documents.push({
      guid: this.randomString(),
      content: ""
    })
  }

  deleteDocument(guid) {
    const ind = this.page.documents.findIndex(doc => doc.guid == guid);
    this.page.documents.splice(ind, 1);
  }

  toggleEditMode() {
    if (!this.editMode) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
    this.editingDocument = "";
  }

  savePage() {
    this.page.documents.forEach(doc => {
      if (doc.content === null) {
        doc.content = "";
      }
    })
    this.pageService.savePage(this.page)
    .subscribe(
      val => {
        if(val.result === 'created' || val.result === 'updated') {
            this.editingDocument = "";
            this.snackBar.open('page saved.', '', { duration: 2000 });
        }else{
            this.snackBar.open('error: page not saved.', '', { duration: 2000 });
        }
    },
      err => {
        console.log(err);
        this.snackBar.open('error: page not saved.', '', { duration: 2000 });
      }
    );
  }

  cancel() {
    this.editMode = false;
    this.editingDocument = "";
    this.pageService.getPage(this.pageTitle)
    .then((page: Page) => this.page.documents = page.documents)
    .catch(err => console.log(err));
  }

  private randomString() {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 20; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
  }

}
