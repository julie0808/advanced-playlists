import { ITag } from "../tag.model";

export const updateTagFromList = (tags: ITag[], tag: ITag) => {
  const cleanArray = removeTagFromList(tags, tag.id);
  const finalArray = addTagToList(cleanArray, tag);

  return finalArray;
}

export const removeTagFromList = (tags: ITag[], tagId: number) => {
  let tagRemoved: boolean = false;
  let checkForInChildren: ITag[] = [];
  let checkForInParents: ITag[] = [];
  let finalTagList: ITag[] = tags;

    checkForInChildren = tags.map(t => {
      let updatedTag = t;
      if ( t.lst_children_tag !== null ) {
        const updatedChildrenList = t.lst_children_tag.filter(tc => {
          if (tc.id !== tagId) {
            return true;
          } else {
            tagRemoved = true;
          }
        });
        updatedTag = {
          ...t,
          lst_children_tag: updatedChildrenList
        };
      }
      return updatedTag;
    })

    if ( tagRemoved ) {
      finalTagList = checkForInChildren;
    } else {      
      checkForInParents = tags.filter(t => {
        if ( t.id !== tagId ) {
          return true;
        } else {
          tagRemoved = true;
        }
      });
      
      if (tagRemoved){
        finalTagList = checkForInParents;
      }
    }

    return finalTagList;
}

export const addTagToList = (tags: ITag[], tag: ITag) => {
  let updatedArray: ITag[] = tags;

    if ( tag.parent_tag_id != 0 ) {
      updatedArray = tags.map(t => {
        if ( t.id === tag.parent_tag_id ) {
          const possibleChildren: ITag[] = t.lst_children_tag || [];
          const modifiedTag = {
            ...t,
            lst_children_tag: [...possibleChildren, tag]
          }
          return modifiedTag;
        }
        return t;
      });
    } else {
      updatedArray = [...tags, tag];
    }

    return reorderTags(updatedArray);
}

export const reorderTags = (tags: ITag[]) => {
  const alphaSortedArrayParents = tags.sort( (x: ITag, y: ITag) => {
    return x.title.localeCompare(y.title);
  });

  const alphaSortedAll = alphaSortedArrayParents.map(t => {
    let childrenToSort: ITag[] = [];
    let finaltag: ITag = t;

    if ( t.lst_children_tag !== null ) {
      childrenToSort = [...t.lst_children_tag];
    }

    const sortedChildren = childrenToSort.sort( (x: ITag, y: ITag) => {
      return x.title.localeCompare(y.title);
    });

    finaltag = {
      ...t,
      lst_children_tag: sortedChildren
    }
    return finaltag;
  })

  return alphaSortedAll;
}