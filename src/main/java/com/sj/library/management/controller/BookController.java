package com.sj.library.management.controller;

import com.sj.library.management.service.BookService;
import com.sj.library.management.to.BookTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping(value = "/book")
public class BookController extends BaseController {

    @Autowired
    private BookService bookService;

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseBody
    public void addBook(@Valid @RequestBody BookTO to) {
        bookService.addBook(to);
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public void deleteBook(@RequestParam long id) {
        bookService.deleteBook(id);
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    @ResponseBody
    public void editBook(@Valid @RequestBody BookTO to) {
        bookService.editBook(to);
    }
}
