import { Tag } from "../tag.model";

export const updateTagFromList = (tags: Tag[], tag: Tag) => {
  const cleanArray = removeTagFromList(tags, tag.id);
  const finalArray = addTagToList(cleanArray, tag);

  return finalArray;
}

export const removeTagFromList = (tags: Tag[], tagId: number) => {
  let tagRemoved: boolean = false;
  let checkForInChildren: Tag[] = [];
  let checkForInParents: Tag[] = [];
  let finalTagList: Tag[] = tags;

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

export const addTagToList = (tags: Tag[], tag: Tag) => {
  let updatedArray: Tag[] = tags;

    if ( tag.parent_tag_id != 0 ) {
      updatedArray = tags.map(t => {
        if ( t.id === tag.parent_tag_id ) {
          const possibleChildren: Tag[] = t.lst_children_tag || [];
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

    return orderTagsAlphabeticallyWithChildren(updatedArray);
}

export const orderTagsAlphabetically = (tags: Tag[]) => {
  const alphaSorted = tags.sort( (x: Tag, y: Tag) => {
    return x.title.localeCompare(y.title);
  });

  return alphaSorted;
}

export const orderTagsAlphabeticallyWithChildren = (tags: Tag[]) => {
  const alphaSortedArrayParents = tags.sort( (x: Tag, y: Tag) => {
    return x.title.localeCompare(y.title);
  });

  const alphaSortedAll = alphaSortedArrayParents.map(t => {
    let childrenToSort: Tag[] = [];
    let finaltag: Tag = t;

    if ( t.lst_children_tag !== null ) {
      childrenToSort = [...t.lst_children_tag];
    }

    const sortedChildren = childrenToSort.sort( (x: Tag, y: Tag) => {
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

export const sortTagsForPrimeNg = (tags: Tag[]) => {
  // PrimeNG needs to have tags grouped. 
  // can't have "stand-alone" tag AND grouped ones
  const onlyNonArtistTags = tags.filter(tag => tag.id !== 55);
  
  const nonArtistTagOtherList = onlyNonArtistTags.filter(tag => {
    const nbChildren = tag.lst_children_tag ? tag.lst_children_tag?.length : 0;
    return nbChildren === 0;
  });

  const nonArtistTagGroup = onlyNonArtistTags.filter(tag => {
    const nbChildren = tag.lst_children_tag ? tag.lst_children_tag?.length : 0;
    return nbChildren > 0;
  });

  const otherTagGroup: Tag = new Tag();
  otherTagGroup.title = 'Other';
  otherTagGroup.lst_children_tag = nonArtistTagOtherList;
  
  const combinedOtherTagGroups = [otherTagGroup, ...nonArtistTagGroup];

  return combinedOtherTagGroups;
}