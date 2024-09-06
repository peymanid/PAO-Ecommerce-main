import { Combobox, ComboboxStore, InputBase } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import React from 'react';
import { formSchema } from './page';

type comboWrapperTypes = {
  comboState: ComboboxStore;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  children: React.ReactNode;
  label: string;
  form: UseFormReturnType<formSchema>;
};

const ComboboxWrapper = ({
  comboState,
  form,
  setSearch,
  search,
  label,
  children,
}: comboWrapperTypes) => {
  return (
    <Combobox
      variant=""
      width={300}
      store={comboState}
      onOptionSubmit={(val) => {
        form.setFieldValue(`information.${label}`, val);
        setSearch(val);
        comboState.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          styles={{
            input: {
              border: '.1px solid var(--testColor)',
              boxShadow: '20px 20px 48px #bebebe,-20px -20px 48px #ffffff',
            },
            label: {
              position: 'relative',
              zIndex: 1,
            },
          }}
          value={search}
          label={label}
          onChange={(event) => setSearch(event.currentTarget.value)}
          m={10}
          w={300}
          rightSection={<Combobox.Chevron />}
          onClick={() => comboState.openDropdown()}
        ></InputBase>
      </Combobox.Target>

      <Combobox.Dropdown w={300} data-cy={'test-user-options'}>
        <Combobox.Options
          style={{ overflowY: 'auto' }}
          w={300}
          mah={300}
          mih={25}
        >
          {children}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default ComboboxWrapper;
