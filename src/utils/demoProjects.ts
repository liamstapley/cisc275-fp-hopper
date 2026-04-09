import type { Project } from "../types";

export const demoProjects: Project[] = [
  {
    id: "demo-todo",
    name: "Todo App",
    description: "A simple todo list application",
    pages: {
      "page-index": {
        id: "page-index",
        name: "index",
        description: "Main todo list page",
        ifAnnotation: "",
        forAnnotation: "",
        stateChanges: "",
        position: { x: 100, y: 100 },
        style: {},
        components: [
          {
            id: "comp-1",
            type: "header",
            props: { text: "My Todo List" },
            style: {}
          },
          {
            id: "comp-2",
            type: "textbox",
            props: { placeholder: "Add a new item..." },
            style: {}
          },
          {
            id: "comp-3",
            type: "button",
            props: { text: "Add Item" },
            style: {}
          }
        ]
      },
      "page-detail": {
        id: "page-detail",
        name: "item_detail",
        description: "Detail view for a todo item",
        ifAnnotation: "",
        forAnnotation: "",
        stateChanges: "",
        position: { x: 400, y: 100 },
        style: {},
        components: [
          {
            id: "comp-4",
            type: "header",
            props: { text: "Item Detail" },
            style: {}
          },
          {
            id: "comp-5",
            type: "text",
            props: { text: "Task details here" },
            style: {}
          },
          {
            id: "comp-6",
            type: "button",
            props: { text: "Back to List" },
            style: {}
          }
        ]
      }
    },
    routes: {
      "route-1": {
        id: "route-1",
        name: "view_detail",
        from: "page-index",
        to: "page-detail",
        ifAnnotation: "",
        forAnnotation: "",
        stateChanges: ""
      }
    },
    stateModel: {
      primaryState: {
        id: "state-1",
        name: "State",
        attributes: [
          {
            id: "attr-1",
            name: "items",
            type: "list[str]",
            description: "List of todo items",
            defaultValue: ""
          },
          {
            id: "attr-2",
            name: "current_item",
            type: "str",
            description: "Currently selected item",
            defaultValue: ""
          }
        ]
      },
      secondaryDataclasses: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "demo-blog",
    name: "Blog Platform",
    description: "A simple blog with posts and comments",
    pages: {
      "page-home": {
        id: "page-home",
        name: "index",
        description: "Blog homepage",
        ifAnnotation: "",
        forAnnotation: "",
        stateChanges: "",
        position: { x: 100, y: 100 },
        style: {},
        components: [
          {
            id: "comp-b1",
            type: "header",
            props: { text: "My Blog" },
            style: {}
          },
          {
            id: "comp-b2",
            type: "text",
            props: { text: "Latest posts" },
            style: {}
          },
          {
            id: "comp-b3",
            type: "button",
            props: { text: "New Post" },
            style: {}
          }
        ]
      },
      "page-post": {
        id: "page-post",
        name: "view_post",
        description: "View a single blog post",
        ifAnnotation: "",
        forAnnotation: "",
        stateChanges: "",
        position: { x: 400, y: 100 },
        style: {},
        components: [
          {
            id: "comp-b4",
            type: "header",
            props: { text: "Post Title" },
            style: {}
          },
          {
            id: "comp-b5",
            type: "text",
            props: { text: "Post content goes here" },
            style: {}
          },
          {
            id: "comp-b6",
            type: "textarea",
            props: { placeholder: "Write a comment..." },
            style: {}
          },
          {
            id: "comp-b7",
            type: "button",
            props: { text: "Add Comment" },
            style: {}
          }
        ]
      },
      "page-new-post": {
        id: "page-new-post",
        name: "create_post",
        description: "Create a new post",
        ifAnnotation: "",
        forAnnotation: "",
        stateChanges: "",
        position: { x: 100, y: 300 },
        style: {},
        components: [
          {
            id: "comp-b8",
            type: "header",
            props: { text: "New Post" },
            style: {}
          },
          {
            id: "comp-b9",
            type: "textbox",
            props: { placeholder: "Post title..." },
            style: {}
          },
          {
            id: "comp-b10",
            type: "textarea",
            props: { placeholder: "Write your post..." },
            style: {}
          },
          {
            id: "comp-b11",
            type: "button",
            props: { text: "Publish" },
            style: {}
          }
        ]
      }
    },
    routes: {
      "route-b1": {
        id: "route-b1",
        name: "read_post",
        from: "page-home",
        to: "page-post",
        ifAnnotation: "",
        forAnnotation: "",
        stateChanges: ""
      },
      "route-b2": {
        id: "route-b2",
        name: "new_post",
        from: "page-home",
        to: "page-new-post",
        ifAnnotation: "",
        forAnnotation: "",
        stateChanges: ""
      },
      "route-b3": {
        id: "route-b3",
        name: "back_to_home",
        from: "page-new-post",
        to: "page-home",
        ifAnnotation: "",
        forAnnotation: "",
        stateChanges: ""
      }
    },
    stateModel: {
      primaryState: {
        id: "state-b1",
        name: "State",
        attributes: [
          {
            id: "attr-b1",
            name: "posts",
            type: "list[str]",
            description: "List of blog posts",
            defaultValue: ""
          },
          {
            id: "attr-b2",
            name: "username",
            type: "str",
            description: "Current user name",
            defaultValue: ""
          }
        ]
      },
      secondaryDataclasses: [
        {
          id: "dc-b1",
          name: "Post",
          attributes: [
            {
              id: "attr-b3",
              name: "title",
              type: "str",
              description: "Post title",
              defaultValue: ""
            },
            {
              id: "attr-b4",
              name: "content",
              type: "str",
              description: "Post content",
              defaultValue: ""
            }
          ]
        }
      ]
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
